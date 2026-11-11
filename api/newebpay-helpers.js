const crypto = require('crypto')

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

const MEMBERSHIP_PRICE_BY_FREQUENCY = {
  one_time: 10,
  monthly: 99,
  yearly: 1800,
  halfyearly: 1000,
}

/*
 * apigateway 產生的 newebpayPayload 會出現的欄位（見 apigateway/payment/newebpay.go），
 * 加上前端補的 frequency。其他欄位一律拒絕。
 */
const MEMBERSHIP_TRADE_INFO_FIELDS = new Set([
  'MerchantID',
  'Amt',
  'Email',
  'EmailModify',
  'LoginType',
  'MerchantOrderNo',
  'NotifyURL',
  'RespondType',
  'TimeStamp',
  'TokenTerm',
  'ClientBackURL',
  'CREDITAGREEMENT',
  'ItemDesc',
  'OrderComment',
  'P3D',
  'TradeLimit',
  'frequency',
])

// 舊版前端會一起送上來，收下但一律以 server 的值覆蓋
const MEMBERSHIP_TRADE_INFO_OVERRIDDEN = new Set([
  'ReturnURL',
  'CREDIT',
  'Version',
])

const MEMBERSHIP_TRADE_INFO_REQUIRED = [
  'MerchantID',
  'Amt',
  'Email',
  'MerchantOrderNo',
  'frequency',
]

class TradeInfoValidationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'TradeInfoValidationError'
  }
}

/**
 * 會員訂閱送藍新前的收斂：只保留白名單欄位、金額必須和方案一致、
 * ReturnURL / CREDIT / Version / RespondType 由 server 決定，不吃前端送來的值。
 */
function buildMembershipTradeInfo(body, { returnUrl }) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new TradeInfoValidationError('tradeInfo must be an object')
  }
  const unknown = Object.keys(body).filter(
    (key) =>
      !MEMBERSHIP_TRADE_INFO_FIELDS.has(key) &&
      !MEMBERSHIP_TRADE_INFO_OVERRIDDEN.has(key)
  )
  if (unknown.length) {
    throw new TradeInfoValidationError(
      `unexpected field: ${unknown.sort().join(', ')}`
    )
  }
  const missing = MEMBERSHIP_TRADE_INFO_REQUIRED.filter(
    (key) => body[key] === undefined || body[key] === null || body[key] === ''
  )
  if (missing.length) {
    throw new TradeInfoValidationError(
      `missing field: ${missing.sort().join(', ')}`
    )
  }

  const expectedAmt = MEMBERSHIP_PRICE_BY_FREQUENCY[body.frequency]
  if (expectedAmt === undefined) {
    throw new TradeInfoValidationError('frequency is not supported')
  }
  if (String(body.Amt) !== String(expectedAmt)) {
    throw new TradeInfoValidationError('Amt is not correct input')
  }

  const tradeInfo = {}
  MEMBERSHIP_TRADE_INFO_FIELDS.forEach((key) => {
    if (body[key] !== undefined) tradeInfo[key] = body[key]
  })
  tradeInfo.ReturnURL = returnUrl
  tradeInfo.CREDIT = 1
  tradeInfo.Version = '2.2'
  tradeInfo.RespondType = 'JSON'
  return tradeInfo
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
  buildMembershipTradeInfo,
  getOrderBindingSecret,
  buildOrderBindingCookie,
  readCookie,
  isOrderBoundToRequest,
}
