const crypto = require('crypto')
const { parse: parseQueryString } = require('querystring')

const ORDER_BINDING_COOKIE = 'mm_papermag_order'
const ORDER_BINDING_MAX_AGE = 60 * 60 * 2

/**
 * 以 NewebPay 規範（HashKey=<key>&<TradeInfo>&HashIV=<iv> 做 SHA256）重算 TradeSha，
 * 和藍新回傳的 TradeSha 比對，任何不符都視為無效。
 */
function verifyTradeSha(tradeInfo, tradeSha, key, iv) {
  if (
    typeof tradeInfo !== 'string' ||
    typeof tradeSha !== 'string' ||
    !tradeInfo ||
    !tradeSha
  ) {
    return false
  }
  const expected = crypto
    .createHash('sha256')
    .update(`HashKey=${key}&${tradeInfo}&HashIV=${iv}`, 'ascii')
    .digest('hex')
    .toUpperCase()
  const actual = tradeSha.toUpperCase()
  if (expected.length !== actual.length) return false
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(actual))
}

/**
 * 只接受藍新回傳的 JSON 結構（{ Status, Message, Result: { MerchantOrderNo, ... } }），
 * 其他格式（例如自己 encrypt 出來的 querystring）一律當成無效，不再嘗試從 key 裡 JSON.parse。
 */
function parseNewebpayCallback(decryptedTradeInfo) {
  if (!decryptedTradeInfo || typeof decryptedTradeInfo !== 'object') {
    return null
  }
  const { Status, Result } = decryptedTradeInfo
  if (typeof Status !== 'string' || !Result || typeof Result !== 'object') {
    return null
  }
  const merchantOrderNo = Result.MerchantOrderNo
  if (
    (typeof merchantOrderNo !== 'string' &&
      typeof merchantOrderNo !== 'number') ||
    merchantOrderNo === ''
  ) {
    return null
  }
  return {
    status: Status,
    merchantOrderNo: String(merchantOrderNo),
    result: Result,
  }
}

const MEMBERSHIP_FREQUENCIES = ['one_time', 'monthly', 'halfyearly', 'yearly']
const MEMBERSHIP_CATEGORIES = ['B2B', 'B2C']

// 前端表單會送上來的欄位；paymentMethod / status 收下但由 server 決定
const SUBSCRIPTION_INPUT_FIELDS = new Set([
  'email',
  'frequency',
  'paymentMethod',
  'status',
  'promoteId',
  'postId',
  'loveCode',
  'carrierType',
  'carrierNum',
  'buyerName',
  'buyerUBN',
  'category',
])
const SUBSCRIPTION_OPTIONAL_STRING_FIELDS = [
  'carrierType',
  'carrierNum',
  'buyerName',
  'buyerUBN',
]
const SUBSCRIPTION_STRING_MAX_LENGTH = 200

class TradeInfoValidationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'TradeInfoValidationError'
  }
}

function toOptionalInt(value, name) {
  if (value === undefined || value === null || value === '') return null
  if (typeof value === 'number' && Number.isNaN(value)) return null
  const number = Number(value)
  if (!Number.isInteger(number)) {
    throw new TradeInfoValidationError(`${name} must be an integer`)
  }
  return number
}

/**
 * 把訂閱表單整理成 apigateway createSubscription mutation 的 variables。
 * paymentMethod / status 一律由 server 給；藍新 payload（含 Amt、MerchantOrderNo、NotifyURL）
 * 之後由 apigateway 產生，前端完全碰不到。
 */
function buildSubscriptionVariables(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new TradeInfoValidationError('body must be an object')
  }
  const unknown = Object.keys(body).filter(
    (key) => !SUBSCRIPTION_INPUT_FIELDS.has(key)
  )
  if (unknown.length) {
    throw new TradeInfoValidationError(
      `unexpected field: ${unknown.sort().join(', ')}`
    )
  }
  if (typeof body.email !== 'string' || !body.email.trim()) {
    throw new TradeInfoValidationError('missing field: email')
  }
  if (!MEMBERSHIP_FREQUENCIES.includes(body.frequency)) {
    throw new TradeInfoValidationError('frequency is not supported')
  }
  if (!MEMBERSHIP_CATEGORIES.includes(body.category)) {
    throw new TradeInfoValidationError('category is not supported')
  }
  const isOneTime = body.frequency === 'one_time'
  if (isOneTime && (typeof body.postId !== 'string' || !body.postId)) {
    throw new TradeInfoValidationError('missing field: postId')
  }

  const variables = {
    email: body.email.trim(),
    paymentMethod: 'newebpay',
    status: 'paying',
    promoteId: toOptionalInt(body.promoteId, 'promoteId') ?? 0,
    loveCode: toOptionalInt(body.loveCode, 'loveCode'),
    category: body.category,
  }
  SUBSCRIPTION_OPTIONAL_STRING_FIELDS.forEach((key) => {
    const value = body[key]
    if (value === undefined || value === null) {
      variables[key] = ''
      return
    }
    if (
      typeof value !== 'string' ||
      value.length > SUBSCRIPTION_STRING_MAX_LENGTH
    ) {
      throw new TradeInfoValidationError(`${key} is not valid`)
    }
    variables[key] = value
  })
  if (isOneTime) {
    variables.postId = body.postId
  } else {
    variables.frequency = body.frequency
  }
  return { isOneTime, variables }
}

/**
 * apigateway 回的 newebpayPayload 是 querystring；解開後由 server 補上
 * ReturnURL / CREDIT / Version / RespondType 再加密。
 */
function buildMembershipTradeInfo(newebpayPayload, { returnUrl }) {
  if (typeof newebpayPayload !== 'string' || !newebpayPayload) {
    throw new TradeInfoValidationError('newebpayPayload is empty')
  }
  const tradeInfo = { ...parseQueryString(newebpayPayload) }
  const missing = ['MerchantID', 'Amt', 'MerchantOrderNo', 'NotifyURL'].filter(
    (key) => typeof tradeInfo[key] !== 'string' || !tradeInfo[key]
  )
  if (missing.length) {
    throw new TradeInfoValidationError(
      `newebpayPayload missing field: ${missing.join(', ')}`
    )
  }
  tradeInfo.ReturnURL = returnUrl
  tradeInfo.CREDIT = 1
  tradeInfo.Version = '2.2'
  tradeInfo.RespondType = 'JSON'
  return tradeInfo
}

/**
 * nuxt 代打 apigateway 時把原始客戶端 IP 接在 X-Forwarded-For 後面，
 * 讓 apigateway 看到的不是 nuxt pod 的 IP。
 */
function buildForwardedFor(req) {
  const remote = req?.socket?.remoteAddress || req?.connection?.remoteAddress
  const existing = req?.headers?.['x-forwarded-for']
  const parts = []
  if (typeof existing === 'string' && existing.trim()) {
    parts.push(existing.trim())
  } else if (Array.isArray(existing)) {
    parts.push(...existing.filter(Boolean))
  }
  if (remote) parts.push(remote)
  return parts.join(', ')
}

function getOrderBindingSecret(key, iv) {
  return `${key}:${iv}`
}

function signOrderNumber(orderNumber, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(String(orderNumber))
    .digest('hex')
}

/**
 * 下單當下發給瀏覽器的綁定 cookie；結果頁只對持有同一張 cookie 的瀏覽器顯示個資。
 * 藍新是跨站 POST 回來，所以要 SameSite=None + Secure 才帶得到。
 */
function buildOrderBindingCookie(orderNumber, secret) {
  const value = `${orderNumber}.${signOrderNumber(orderNumber, secret)}`
  return [
    `${ORDER_BINDING_COOKIE}=${encodeURIComponent(value)}`,
    'Path=/papermag/return',
    `Max-Age=${ORDER_BINDING_MAX_AGE}`,
    'HttpOnly',
    'Secure',
    'SameSite=None',
  ].join('; ')
}

function readCookie(cookieHeader, name) {
  if (typeof cookieHeader !== 'string' || !cookieHeader) return undefined
  for (const part of cookieHeader.split(';')) {
    const index = part.indexOf('=')
    if (index === -1) continue
    if (part.slice(0, index).trim() !== name) continue
    try {
      return decodeURIComponent(part.slice(index + 1).trim())
    } catch (e) {
      return undefined
    }
  }
  return undefined
}

function isOrderBoundToRequest(cookieHeader, orderNumber, secret) {
  const value = readCookie(cookieHeader, ORDER_BINDING_COOKIE)
  if (!value || !orderNumber) return false
  const index = value.lastIndexOf('.')
  if (index === -1) return false
  const cookieOrderNumber = value.slice(0, index)
  const signature = value.slice(index + 1)
  if (cookieOrderNumber !== String(orderNumber)) return false
  const expected = signOrderNumber(orderNumber, secret)
  if (expected.length !== signature.length) return false
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}

module.exports = {
  ORDER_BINDING_COOKIE,
  TradeInfoValidationError,
  verifyTradeSha,
  parseNewebpayCallback,
  buildSubscriptionVariables,
  buildMembershipTradeInfo,
  buildForwardedFor,
  getOrderBindingSecret,
  buildOrderBindingCookie,
  readCookie,
  isOrderBoundToRequest,
}
