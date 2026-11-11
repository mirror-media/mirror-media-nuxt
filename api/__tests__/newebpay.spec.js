jest.mock('axios')
jest.mock('@mirrormedia/newebpay-node')
const axios = require('axios')
const NewebPay = require('@mirrormedia/newebpay-node')
const handler = require('../newebpay')

const FORM = {
  MerchantID: 'M1',
  TradeInfo: 'aes',
  TradeSha: 'SHA',
  Version: '2.2',
}

const validBody = {
  MerchantID: 'M1',
  Amt: '1800',
  Email: 'member@example.com',
  EmailModify: '0',
  LoginType: '0',
  MerchantOrderNo: 'S2026111100001',
  NotifyURL: 'https://hook',
  RespondType: 'JSON',
  TimeStamp: '1700000000',
  CREDITAGREEMENT: '1',
  ItemDesc: 'yearly',
  frequency: 'yearly',
}

function createRes() {
  const res = {
    send: jest.fn(),
    status: jest.fn(),
  }
  res.status.mockReturnValue(res)
  return res
}

function createReq({ method = 'POST', authorization, body = validBody } = {}) {
  return { method, headers: authorization ? { authorization } : {}, body }
}

describe('/api/v2/newebpay/v1', () => {
  let getEncryptedFormPostData
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, 'log').mockImplementation(() => {})
    getEncryptedFormPostData = jest.fn(() => FORM)
    NewebPay.mockImplementation(() => ({ getEncryptedFormPostData }))
    axios.get.mockResolvedValue({ data: { tokenState: 'OK' } })
  })
  afterEach(() => {
    console.log.mockRestore()
  })

  test('rejects non-POST', async () => {
    const res = createRes()
    await handler(createReq({ method: 'GET', authorization: 'Bearer t' }), res)
    expect(res.status).toHaveBeenCalledWith(405)
    expect(axios.get).not.toHaveBeenCalled()
  })

  test('rejects anonymous requests without calling tokenState', async () => {
    const res = createRes()
    await handler(createReq(), res)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(axios.get).not.toHaveBeenCalled()
    expect(getEncryptedFormPostData).not.toHaveBeenCalled()
  })

  test('rejects a token apigateway does not accept', async () => {
    axios.get.mockResolvedValue({ data: { tokenState: 'EXPIRED' } })
    const res = createRes()
    await handler(createReq({ authorization: 'Bearer bad' }), res)
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/v1\/tokenState$/),
      expect.objectContaining({ headers: { Authorization: 'Bearer bad' } })
    )
    expect(res.status).toHaveBeenCalledWith(401)
    expect(getEncryptedFormPostData).not.toHaveBeenCalled()
  })

  test('treats a tokenState failure as unauthorized', async () => {
    axios.get.mockRejectedValue(new Error('boom'))
    const res = createRes()
    await handler(createReq({ authorization: 'Bearer t' }), res)
    expect(res.status).toHaveBeenCalledWith(401)
  })

  test('rejects unknown fields and wrong Amt with 400', async () => {
    let res = createRes()
    await handler(
      createReq({
        authorization: 'Bearer t',
        body: { ...validBody, Status: 'SUCCESS' },
      }),
      res
    )
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.send).toHaveBeenCalledWith({
      status: 'error',
      message: 'unexpected field: Status',
    })

    res = createRes()
    await handler(
      createReq({ authorization: 'Bearer t', body: { ...validBody, Amt: 1 } }),
      res
    )
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.send).toHaveBeenCalledWith({
      status: 'error',
      message: 'Amt is not correct input',
    })
    expect(getEncryptedFormPostData).not.toHaveBeenCalled()
  })

  test('encrypts the sanitized tradeInfo for a logged-in member', async () => {
    const res = createRes()
    await handler(
      createReq({
        authorization: 'Bearer t',
        body: { ...validBody, ReturnURL: 'https://evil', Version: '1.0' },
      }),
      res
    )
    expect(res.status).toHaveBeenCalledTimes(0)
    expect(res.send).toHaveBeenCalledWith(FORM)
    const passed = getEncryptedFormPostData.mock.calls[0][0]
    expect(passed).toMatchObject({
      ...validBody,
      ReturnURL: 'http://localhost:3000/subscribe/return',
      CREDIT: 1,
      Version: '2.2',
      RespondType: 'JSON',
    })
    expect(Object.keys(passed).sort()).toEqual(
      [...Object.keys(validBody), 'ReturnURL', 'CREDIT', 'Version'].sort()
    )
  })

  test('returns 500 without leaking details when encryption fails', async () => {
    getEncryptedFormPostData.mockImplementation(() => {
      throw new Error('Invalid key length')
    })
    const res = createRes()
    await handler(createReq({ authorization: 'Bearer t' }), res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith({
      status: 'error',
      message: 'encrypt failed',
    })
  })
})
