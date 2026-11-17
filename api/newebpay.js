const axios = require('axios')
const NewebPay = require('@mirrormedia/newebpay-node')
const {
  NEWEBPAY_KEY,
  NEWEBPAY_IV,
  ENV,
  DOMAIN_NAME,
  API_PROTOCOL,
  API_MEMBER_SUBSCRIPTION_GATEWAY,
} = require('../configs/config')
const {
  buildSubscriptionVariables,
  buildMembershipTradeInfo,
  buildForwardedFor,
  TradeInfoValidationError,
} = require('./newebpay-helpers')

const RETURN_URL =
  ENV === 'local'
    ? 'http://localhost:3000/subscribe/return'
    : `https://${DOMAIN_NAME}/subscribe/return`

const MEMBER_GRAPHQL_URL = `${API_PROTOCOL}://${API_MEMBER_SUBSCRIPTION_GATEWAY}`
const MEMBER_GRAPHQL_TIMEOUT = 5000

// 和 apollo/mutations/memberSubscriptionMutation.gql 的兩個 mutation 相同，server 端不吃 .gql 所以寫成字串
const CREATE_SUBSCRIPTION_RECURRING = `
mutation fetchPaymentDataOfSubscriptionRecurring(
  $email: String!
  $frequency: subscriptionFrequencyType!
  $paymentMethod: subscriptionPaymentMethodType!
  $status: createSubscriptionStatusType!
  $promoteId: Int
  $loveCode: Int
  $carrierType: String
  $carrierNum: String
  $buyerName: String
  $buyerUBN: String
  $category: subscriptionCategoryType!
) {
  createSubscriptionRecurring(
    data: {
      email: $email
      frequency: $frequency
      paymentMethod: $paymentMethod
      status: $status
      promoteId: $promoteId
      loveCode: $loveCode
      carrierType: $carrierType
      carrierNum: $carrierNum
      buyerName: $buyerName
      buyerUBN: $buyerUBN
      category: $category
    }
    info: { returnToPath: "" }
  ) {
    newebpayPayload
  }
}
`

const CREATE_SUBSCRIPTION_ONE_TIME = `
mutation fetchPaymentDataOfSubscriptionOneTime(
  $email: String!
  $paymentMethod: subscriptionPaymentMethodType!
  $status: createSubscriptionStatusType!
  $promoteId: Int
  $postId: String!
  $loveCode: Int
  $carrierType: String
  $carrierNum: String
  $buyerName: String
  $buyerUBN: String
  $category: subscriptionCategoryType!
) {
  createsSubscriptionOneTime(
    data: {
      email: $email
      paymentMethod: $paymentMethod
      status: $status
      postId: $postId
      promoteId: $promoteId
      loveCode: $loveCode
      carrierType: $carrierType
      carrierNum: $carrierNum
      buyerName: $buyerName
      buyerUBN: $buyerUBN
      category: $category
    }
    info: { postSlug: "", postTitle: "", returnToPath: "" }
  ) {
    newebpayPayload
  }
}
`

class GatewayError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'GatewayError'
    this.status = status
  }
}

function log(severity, message, extra = {}) {
  console.log(JSON.stringify({ severity, message, ...extra }))
}

/*
 * 帶著會員 token 請 apigateway 建 subscription 並產生藍新 payload。
 * token 由 apigateway 驗（Firebase ID token），沒帶或無效會回 401。
 */
async function createSubscription(req, { isOneTime, variables }) {
  let response
  try {
    response = await axios.post(
      MEMBER_GRAPHQL_URL,
      {
        query: isOneTime
          ? CREATE_SUBSCRIPTION_ONE_TIME
          : CREATE_SUBSCRIPTION_RECURRING,
        variables,
      },
      {
        headers: {
          'content-type': 'application/json',
          'Cache-Control': 'no-store',
          Authorization: req.headers.authorization,
          'X-Forwarded-For': buildForwardedFor(req),
        },
        timeout: MEMBER_GRAPHQL_TIMEOUT,
      }
    )
  } catch (e) {
    const status = e.response?.status
    if (status === 401 || status === 403) {
      throw new GatewayError('unauthorized', 401)
    }
    throw new GatewayError(
      `apigateway request failed: ${status || e.message}`,
      502
    )
  }

  const { data, errors } = response.data || {}
  if (Array.isArray(errors) && errors.length) {
    throw new GatewayError(
      `apigateway returned errors: ${errors
        .map((error) => error?.message)
        .join('; ')}`,
      502
    )
  }
  const payload = isOneTime
    ? data?.createsSubscriptionOneTime?.newebpayPayload
    : data?.createSubscriptionRecurring?.newebpayPayload
  if (typeof payload !== 'string' || !payload) {
    throw new GatewayError('apigateway returned no newebpayPayload', 502)
  }
  return payload
}

module.exports = async function (req, res) {
  if (req.method !== 'POST') {
    res.status(405).send({ status: 'error', message: 'method not allowed' })
    return
  }

  const authorization = req.headers?.authorization
  if (
    typeof authorization !== 'string' ||
    !/^Bearer \S+$/.test(authorization)
  ) {
    res.status(401).send({ status: 'error', message: 'unauthorized' })
    return
  }

  let input
  try {
    input = buildSubscriptionVariables(req.body)
  } catch (e) {
    if (!(e instanceof TradeInfoValidationError)) throw e
    log('WARNING', `newebpay/v1 rejected input: ${e.message}`)
    res.status(400).send({ status: 'error', message: e.message })
    return
  }

  let tradeInfo
  try {
    const payload = await createSubscription(req, input)
    tradeInfo = buildMembershipTradeInfo(payload, { returnUrl: RETURN_URL })
  } catch (e) {
    if (e instanceof GatewayError) {
      if (e.status !== 401) {
        log('ERROR', `newebpay/v1 ${e.message}`, {
          email: input.variables.email,
        })
      }
      res.status(e.status).send({
        status: 'error',
        message:
          e.status === 401 ? 'unauthorized' : 'create subscription failed',
      })
      return
    }
    if (e instanceof TradeInfoValidationError) {
      log('ERROR', `newebpay/v1 ${e.message}`, { email: input.variables.email })
      res
        .status(502)
        .send({ status: 'error', message: 'create subscription failed' })
      return
    }
    throw e
  }

  try {
    const newebpay = new NewebPay(NEWEBPAY_KEY, NEWEBPAY_IV)
    const encryptPostData = await newebpay.getEncryptedFormPostData(tradeInfo)
    res.send(encryptPostData)
  } catch (e) {
    log('ERROR', `newebpay/v1 encrypt error: ${e.message}`, {
      email: tradeInfo.Email,
      merchantOrderNo: tradeInfo.MerchantOrderNo,
    })
    res.status(500).send({ status: 'error', message: 'encrypt failed' })
  }
}
