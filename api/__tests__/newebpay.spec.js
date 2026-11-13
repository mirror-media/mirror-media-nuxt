jest.mock('axios')
jest.mock('@mirrormedia/newebpay-node')
const axios = require('axios')
const NewebPay = require('@mirrormedia/newebpay-node')
const handler = require('../newebpay')
const {
  API_PROTOCOL,
  API_MEMBER_SUBSCRIPTION_GATEWAY,
} = require('../../configs/config')

const FORM = {
  MerchantID: 'M1',
  TradeInfo: 'aes',
  TradeSha: 'SHA',
  Version: '2.2',
}

const PAYLOAD =
  'MerchantID=M1&Amt=1800&Email=member%40example.com&MerchantOrderNo=S2026111100001' +
  '&NotifyURL=https%3A%2F%2Fhook%2Fnewebpay%2Fpremium%3Fcode%3Dyearly' +
  '&RespondType=String&TimeStamp=1700000000&CREDITAGREEMENT=1&TokenTerm=uid'

const recurringForm = {
  email: 'member@example.com',
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

const oneTimeForm = {
  ...recurringForm,
  frequency: 'one_time',
  postId: '123',
}

function gatewayResponse(field, payload = PAYLOAD) {
  return { data: { data: { [field]: { newebpayPayload: payload } } } }
}

function createRes() {
  const res = {
    send: jest.fn(),
    status: jest.fn(),
  }
  res.status.mockReturnValue(res)
  return res
}

function createReq({
  method = 'POST',
  authorization = 'Bearer t',
  body = recurringForm,
  headers = {},
} = {}) {
  return {
    method,
    headers: authorization ? { authorization, ...headers } : headers,
    body,
    socket: { remoteAddress: '10.4.0.7' },
  }
}

describe('/api/v2/newebpay/v1', () => {
  let getEncryptedFormPostData
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, 'log').mockImplementation(() => {})
    getEncryptedFormPostData = jest.fn(() => FORM)
    NewebPay.mockImplementation(() => ({ getEncryptedFormPostData }))
    axios.post.mockResolvedValue(gatewayResponse('createSubscriptionRecurring'))
  })
  afterEach(() => {
    console.log.mockRestore()
  })

  test('rejects non-POST', async () => {
    const res = createRes()
    await handler(createReq({ method: 'GET' }), res)
    expect(res.status).toHaveBeenCalledWith(405)
    expect(axios.post).not.toHaveBeenCalled()
  })

  test('rejects anonymous requests before touching apigateway', async () => {
    const res = createRes()
    await handler(createReq({ authorization: null }), res)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(axios.post).not.toHaveBeenCalled()
    expect(getEncryptedFormPostData).not.toHaveBeenCalled()
  })

  test('rejects NewebPay fields sent from the browser with 400', async () => {
    const res = createRes()
    await handler(
      createReq({
        body: { ...recurringForm, Amt: 10, MerchantOrderNo: 'VICTIM' },
      }),
      res
    )
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.send).toHaveBeenCalledWith({
      status: 'error',
      message: 'unexpected field: Amt, MerchantOrderNo',
    })
    expect(axios.post).not.toHaveBeenCalled()
  })

  test('creates the subscription through apigateway with the member token and client IP', async () => {
    const res = createRes()
    await handler(
      createReq({
        headers: { 'x-forwarded-for': '203.0.113.9' },
      }),
      res
    )

    expect(axios.post).toHaveBeenCalledTimes(1)
    const [url, body, config] = axios.post.mock.calls[0]
    expect(url).toBe(`${API_PROTOCOL}://${API_MEMBER_SUBSCRIPTION_GATEWAY}`)
    expect(body.query).toMatch(/createSubscriptionRecurring/)
    expect(body.variables).toEqual({
      email: 'member@example.com',
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
    })
    expect(config.headers).toMatchObject({
      Authorization: 'Bearer t',
      'X-Forwarded-For': '203.0.113.9, 10.4.0.7',
    })

    expect(res.status).toHaveBeenCalledTimes(0)
    expect(res.send).toHaveBeenCalledWith(FORM)
    expect(getEncryptedFormPostData.mock.calls[0][0]).toEqual({
      MerchantID: 'M1',
      Amt: '1800',
      Email: 'member@example.com',
      MerchantOrderNo: 'S2026111100001',
      NotifyURL: 'https://hook/newebpay/premium?code=yearly',
      TimeStamp: '1700000000',
      CREDITAGREEMENT: '1',
      TokenTerm: 'uid',
      ReturnURL: 'http://localhost:3000/subscribe/return',
      CREDIT: 1,
      Version: '2.2',
      RespondType: 'JSON',
    })
  })

  test('uses the one-time mutation for one_time purchases', async () => {
    axios.post.mockResolvedValue(gatewayResponse('createsSubscriptionOneTime'))
    const res = createRes()
    await handler(createReq({ body: oneTimeForm }), res)
    const [, body] = axios.post.mock.calls[0]
    expect(body.query).toMatch(/createsSubscriptionOneTime/)
    expect(body.variables).toMatchObject({ postId: '123' })
    expect(body.variables.frequency).toBeUndefined()
    expect(res.send).toHaveBeenCalledWith(FORM)
  })

  test('maps an apigateway 401 to 401', async () => {
    axios.post.mockRejectedValue({ response: { status: 401 } })
    const res = createRes()
    await handler(createReq(), res)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(getEncryptedFormPostData).not.toHaveBeenCalled()
  })

  test('returns 502 when apigateway fails or answers with errors', async () => {
    axios.post.mockRejectedValue(new Error('ECONNREFUSED'))
    let res = createRes()
    await handler(createReq(), res)
    expect(res.status).toHaveBeenCalledWith(502)

    axios.post.mockResolvedValue({
      data: { errors: [{ message: 'member not found' }] },
    })
    res = createRes()
    await handler(createReq(), res)
    expect(res.status).toHaveBeenCalledWith(502)

    axios.post.mockResolvedValue(
      gatewayResponse('createSubscriptionRecurring', 'Amt=1800')
    )
    res = createRes()
    await handler(createReq(), res)
    expect(res.status).toHaveBeenCalledWith(502)
    expect(res.send).toHaveBeenLastCalledWith({
      status: 'error',
      message: 'create subscription failed',
    })
    expect(getEncryptedFormPostData).not.toHaveBeenCalled()
  })

  test('returns 500 without leaking details when encryption fails', async () => {
    getEncryptedFormPostData.mockImplementation(() => {
      throw new Error('Invalid key length')
    })
    const res = createRes()
    await handler(createReq(), res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith({
      status: 'error',
      message: 'encrypt failed',
    })
  })
})
