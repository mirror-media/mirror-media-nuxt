const crypto = require('crypto')
const NewebPay = require('@mirrormedia/newebpay-node')
const {
  ORDER_BINDING_COOKIE,
  TradeInfoValidationError,
  verifyTradeSha,
  parseNewebpayCallback,
  buildMembershipTradeInfo,
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

describe('buildMembershipTradeInfo', () => {
  const returnUrl = 'https://www.mirrormedia.mg/subscribe/return'
  const valid = {
    MerchantID: 'M1',
    Amt: '1800',
    Email: 'a@b.c',
    EmailModify: '0',
    LoginType: '0',
    MerchantOrderNo: 'S2026111100001',
    NotifyURL: 'https://hook',
    RespondType: 'JSON',
    TimeStamp: '1700000000',
    CREDITAGREEMENT: '1',
    ItemDesc: '鏡週刊年訂閱',
    frequency: 'yearly',
  }

  test('keeps the allowed fields and sets ReturnURL/CREDIT/Version itself', () => {
    const result = buildMembershipTradeInfo(
      { ...valid, ReturnURL: 'https://evil', CREDIT: 0, Version: '1.0' },
      { returnUrl }
    )
    expect(result).toMatchObject({
      ...valid,
      ReturnURL: returnUrl,
      CREDIT: 1,
      Version: '2.2',
      RespondType: 'JSON',
    })
  })

  test('rejects unknown fields', () => {
    expect(() =>
      buildMembershipTradeInfo({ ...valid, Status: 'SUCCESS' }, { returnUrl })
    ).toThrow(TradeInfoValidationError)
    expect(() =>
      buildMembershipTradeInfo({ ...valid, Result: {} }, { returnUrl })
    ).toThrow(/unexpected field: Result/)
  })

  test('rejects missing required fields, unknown frequency and wrong Amt', () => {
    const { Email, ...noEmail } = valid
    expect(() => buildMembershipTradeInfo(noEmail, { returnUrl })).toThrow(
      /missing field: Email/
    )
    expect(() =>
      buildMembershipTradeInfo({ ...valid, frequency: 'weekly' }, { returnUrl })
    ).toThrow(/frequency/)
    expect(() =>
      buildMembershipTradeInfo({ ...valid, Amt: '1' }, { returnUrl })
    ).toThrow(/Amt/)
    expect(() => buildMembershipTradeInfo(null, { returnUrl })).toThrow(
      TradeInfoValidationError
    )
    expect(() => buildMembershipTradeInfo([valid], { returnUrl })).toThrow(
      TradeInfoValidationError
    )
  })

  test('accepts every plan price', () => {
    expect(
      buildMembershipTradeInfo(
        { ...valid, Amt: 10, frequency: 'one_time' },
        { returnUrl }
      ).Amt
    ).toBe(10)
    expect(
      buildMembershipTradeInfo(
        { ...valid, Amt: 99, frequency: 'monthly' },
        { returnUrl }
      ).Amt
    ).toBe(99)
    expect(
      buildMembershipTradeInfo(
        { ...valid, Amt: 1000, frequency: 'halfyearly' },
        { returnUrl }
      ).Amt
    ).toBe(1000)
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
