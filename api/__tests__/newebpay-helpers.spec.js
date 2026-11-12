const crypto = require('crypto')
const NewebPay = require('@mirrormedia/newebpay-node')
const {
  ORDER_BINDING_COOKIE,
  TradeInfoValidationError,
  verifyTradeSha,
  parseNewebpayCallback,
  buildSubscriptionVariables,
  buildMembershipTradeInfo,
  buildForwardedFor,
  buildOrderBindingCookie,
  readCookie,
  isOrderBoundToRequest,
} = require('../newebpay-helpers')

const KEY = 'k'.repeat(32)
const IV = 'v'.repeat(16)
const OTHER_KEY = 'x'.repeat(32)
const newebpay = new NewebPay(KEY, IV)

// 模擬藍新回傳：JSON 字串用同一組 key/iv 加密
function encryptJson(obj, key = KEY, iv = IV) {
  const text = JSON.stringify(obj)
  const pad = 32 - (text.length % 32)
  const padded = text + String.fromCharCode(pad).repeat(pad)
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
  return cipher.update(padded, 'binary', 'hex')
}

function shaOf(tradeInfo, key = KEY, iv = IV) {
  return crypto
    .createHash('sha256')
    .update(`HashKey=${key}&${tradeInfo}&HashIV=${iv}`, 'ascii')
    .digest('hex')
    .toUpperCase()
}

describe('verifyTradeSha', () => {
  const tradeInfo = encryptJson({ Status: 'SUCCESS', Result: {} })

  test('accepts the TradeSha computed with the same key/iv', () => {
    expect(verifyTradeSha(tradeInfo, shaOf(tradeInfo), KEY, IV)).toBe(true)
    expect(
      verifyTradeSha(tradeInfo, shaOf(tradeInfo).toLowerCase(), KEY, IV)
    ).toBe(true)
  })

  test('rejects TradeSha made with another key, tampered TradeInfo, or junk', () => {
    expect(
      verifyTradeSha(tradeInfo, shaOf(tradeInfo, OTHER_KEY), KEY, IV)
    ).toBe(false)
    expect(verifyTradeSha(tradeInfo + '00', shaOf(tradeInfo), KEY, IV)).toBe(
      false
    )
    expect(verifyTradeSha(tradeInfo, 'ABC', KEY, IV)).toBe(false)
    expect(verifyTradeSha(tradeInfo, undefined, KEY, IV)).toBe(false)
    expect(verifyTradeSha(undefined, shaOf(tradeInfo), KEY, IV)).toBe(false)
    expect(verifyTradeSha(['a'], shaOf(tradeInfo), KEY, IV)).toBe(false)
  })

  test('matches what newebpay-node produces when encrypting', () => {
    const form = newebpay.getEncryptedFormPostData({
      MerchantID: 'M1',
      Amt: 99,
      Email: 'a@b.c',
    })
    expect(verifyTradeSha(form.TradeInfo, form.TradeSha, KEY, IV)).toBe(true)
  })
})

describe('parseNewebpayCallback', () => {
  test('accepts the JSON structure NewebPay posts back', () => {
    const decrypted = newebpay.getDecryptedTradeInfo(
      encryptJson({
        Status: 'SUCCESS',
        Message: 'ok',
        Result: { MerchantOrderNo: 'P2026111100001', Amt: 1000 },
      })
    )
    expect(parseNewebpayCallback(decrypted)).toEqual({
      status: 'SUCCESS',
      merchantOrderNo: 'P2026111100001',
      result: { MerchantOrderNo: 'P2026111100001', Amt: 1000 },
    })
  })

  test('rejects a TradeInfo minted through getEncryptedFormPostData (querystring format)', () => {
    const forged = newebpay.getEncryptedFormPostData({
      MerchantID: 'M1',
      Amt: 99,
      Email: 'a@b.c',
      '{"Status":"SUCCESS","Result":{"MerchantOrderNo":"VICTIM"}}': '',
    })
    const decrypted = newebpay.getDecryptedTradeInfo(forged.TradeInfo)
    expect(parseNewebpayCallback(decrypted)).toBeNull()
  })

  test('rejects payloads without Status or MerchantOrderNo', () => {
    expect(parseNewebpayCallback(null)).toBeNull()
    expect(parseNewebpayCallback('SUCCESS')).toBeNull()
    expect(parseNewebpayCallback({ Status: 'SUCCESS' })).toBeNull()
    expect(parseNewebpayCallback({ Status: 'SUCCESS', Result: {} })).toBeNull()
    expect(
      parseNewebpayCallback({
        Status: 'SUCCESS',
        Result: { MerchantOrderNo: '' },
      })
    ).toBeNull()
    expect(
      parseNewebpayCallback({ Result: { MerchantOrderNo: 'P1' } })
    ).toBeNull()
  })
})

describe('buildSubscriptionVariables', () => {
  const form = {
    email: 'a@b.c',
    frequency: 'yearly',
    paymentMethod: 'newebpay',
    status: 'paying',
    promoteId: 0,
    loveCode: null,
    carrierType: '',
    carrierNum: '',
    buyerName: '',
    buyerUBN: '',
    category: 'B2C',
  }

  test('maps a recurring form to the recurring mutation variables', () => {
    expect(buildSubscriptionVariables(form)).toEqual({
      isOneTime: false,
      variables: {
        email: 'a@b.c',
        frequency: 'yearly',
        paymentMethod: 'newebpay',
        status: 'paying',
        promoteId: 0,
        loveCode: null,
        carrierType: '',
        carrierNum: '',
        buyerName: '',
        buyerUBN: '',
        category: 'B2C',
      },
    })
  })

  test('maps a one_time form to the one-time mutation variables', () => {
    const result = buildSubscriptionVariables({
      ...form,
      frequency: 'one_time',
      postId: '123',
      loveCode: '919',
      carrierType: '2',
      carrierNum: 'a@b.c',
    })
    expect(result.isOneTime).toBe(true)
    expect(result.variables).toMatchObject({
      postId: '123',
      loveCode: 919,
      carrierType: '2',
      carrierNum: 'a@b.c',
    })
    expect(result.variables.frequency).toBeUndefined()
  })

  test('paymentMethod and status always come from the server', () => {
    expect(
      buildSubscriptionVariables({
        ...form,
        paymentMethod: 'linepay',
        status: 'paid',
      }).variables
    ).toMatchObject({ paymentMethod: 'newebpay', status: 'paying' })
  })

  test('rejects unknown fields and NewebPay payload fields', () => {
    expect(() => buildSubscriptionVariables({ ...form, Amt: 1 })).toThrow(
      /unexpected field: Amt/
    )
    expect(() =>
      buildSubscriptionVariables({ ...form, NotifyURL: 'https://evil' })
    ).toThrow(TradeInfoValidationError)
    expect(() =>
      buildSubscriptionVariables({ ...form, MerchantOrderNo: 'X' })
    ).toThrow(TradeInfoValidationError)
  })

  test('rejects missing or invalid values', () => {
    expect(() => buildSubscriptionVariables({ ...form, email: '' })).toThrow(
      /missing field: email/
    )
    expect(() =>
      buildSubscriptionVariables({ ...form, frequency: 'weekly' })
    ).toThrow(/frequency/)
    expect(() =>
      buildSubscriptionVariables({ ...form, category: 'B2G' })
    ).toThrow(/category/)
    expect(() =>
      buildSubscriptionVariables({ ...form, frequency: 'one_time' })
    ).toThrow(/missing field: postId/)
    expect(() =>
      buildSubscriptionVariables({ ...form, promoteId: 'abc' })
    ).toThrow(/promoteId/)
    expect(() =>
      buildSubscriptionVariables({ ...form, buyerName: 'x'.repeat(201) })
    ).toThrow(/buyerName/)
    expect(() => buildSubscriptionVariables(null)).toThrow(
      TradeInfoValidationError
    )
    expect(() => buildSubscriptionVariables([form])).toThrow(
      TradeInfoValidationError
    )
  })
})

describe('buildMembershipTradeInfo', () => {
  const returnUrl = 'https://www.mirrormedia.mg/subscribe/return'
  const payload =
    'MerchantID=M1&Amt=1800&Email=a%40b.c&MerchantOrderNo=S2026111100001' +
    '&NotifyURL=https%3A%2F%2Fhook%2Fnewebpay%2Fpremium%3Fcode%3Dyearly' +
    '&RespondType=String&TimeStamp=1700000000&CREDITAGREEMENT=1&TokenTerm=uid'

  test('parses the apigateway payload and sets ReturnURL/CREDIT/Version itself', () => {
    expect(buildMembershipTradeInfo(payload, { returnUrl })).toEqual({
      MerchantID: 'M1',
      Amt: '1800',
      Email: 'a@b.c',
      MerchantOrderNo: 'S2026111100001',
      NotifyURL: 'https://hook/newebpay/premium?code=yearly',
      TimeStamp: '1700000000',
      CREDITAGREEMENT: '1',
      TokenTerm: 'uid',
      ReturnURL: returnUrl,
      CREDIT: 1,
      Version: '2.2',
      RespondType: 'JSON',
    })
  })

  test('rejects an empty payload or one missing the fields NewebPay needs', () => {
    expect(() => buildMembershipTradeInfo('', { returnUrl })).toThrow(
      TradeInfoValidationError
    )
    expect(() => buildMembershipTradeInfo(undefined, { returnUrl })).toThrow(
      TradeInfoValidationError
    )
    expect(() =>
      buildMembershipTradeInfo('MerchantID=M1&Amt=1800', { returnUrl })
    ).toThrow(/missing field: MerchantOrderNo, NotifyURL/)
  })
})

describe('buildForwardedFor', () => {
  test('appends the socket address to an existing X-Forwarded-For', () => {
    expect(
      buildForwardedFor({
        headers: { 'x-forwarded-for': '203.0.113.9, 10.0.0.2' },
        socket: { remoteAddress: '10.4.0.7' },
      })
    ).toBe('203.0.113.9, 10.0.0.2, 10.4.0.7')
  })

  test('falls back to the socket address alone', () => {
    expect(
      buildForwardedFor({ headers: {}, socket: { remoteAddress: '10.4.0.7' } })
    ).toBe('10.4.0.7')
    expect(buildForwardedFor({ headers: {} })).toBe('')
  })
})

describe('order binding cookie', () => {
  const secret = 'secret'

  test('cookie attributes allow the cross-site POST from NewebPay', () => {
    const cookie = buildOrderBindingCookie('P1', secret)
    expect(cookie).toMatch(
      new RegExp(`^${ORDER_BINDING_COOKIE}=P1\\.[0-9a-f]{64}; `)
    )
    expect(cookie).toContain('Path=/papermag/return')
    expect(cookie).toContain('HttpOnly')
    expect(cookie).toContain('Secure')
    expect(cookie).toContain('SameSite=None')
  })

  test('readCookie picks the named cookie out of the header', () => {
    expect(
      readCookie('a=1; mm_papermag_order=P1.abc; b=2', ORDER_BINDING_COOKIE)
    ).toBe('P1.abc')
    expect(readCookie('a=1', ORDER_BINDING_COOKIE)).toBeUndefined()
    expect(readCookie(undefined, ORDER_BINDING_COOKIE)).toBeUndefined()
  })

  test('binding only matches the same order number signed with the same secret', () => {
    const header = buildOrderBindingCookie('P1', secret).split(';')[0]
    expect(isOrderBoundToRequest(header, 'P1', secret)).toBe(true)
    expect(isOrderBoundToRequest(header, 'P2', secret)).toBe(false)
    expect(isOrderBoundToRequest(header, 'P1', 'other')).toBe(false)
    expect(
      isOrderBoundToRequest(`${ORDER_BINDING_COOKIE}=P1.deadbeef`, 'P1', secret)
    ).toBe(false)
    expect(
      isOrderBoundToRequest(`${ORDER_BINDING_COOKIE}=P1`, 'P1', secret)
    ).toBe(false)
    expect(isOrderBoundToRequest('', 'P1', secret)).toBe(false)
    expect(isOrderBoundToRequest(header, '', secret)).toBe(false)
  })
})
