import axios from 'axios'
import uuid from 'uuid/v4'
import errors from '@twreporter/errors'
import {
  ENV,
  DOMAIN_NAME,
  API_PATH_FRONTEND,
  ISRAFEL_ORIGIN,
} from '../configs/config.js'
import {
  createOrderNumberByTaipeiTZ,
  fireGqlRequest,
  linepayClient,
} from './helpers'

const baseUrl = 'http://localhost:3000/'
const apiUrl = `${ISRAFEL_ORIGIN}/api/graphql`

async function verifyRequest(req) {
  const bearerHeader = req.headers.authorization

  if (bearerHeader === undefined) {
    return false
  }

  const requestUrl = `${baseUrl}${API_PATH_FRONTEND}/membership/v1/tokenState`
  const requestConfig = {
    headers: {
      Authorization: bearerHeader,
    },
  }

  try {
    const { data } = await axios.get(requestUrl, requestConfig)
    return data.tokenState === 'OK'
  } catch (error) {
    console.error(
      JSON.stringify({
        severity: 'ERROR',
        message: 'error on verifying request',
        debugPayload: {
          message: errors.helpers.printAll(error, {
            withStack: true,
            withPayload: true,
          }),
        },
      })
    )
    return false
  }
}

async function getMerchandiseInfo(code) {
  const query = `
    query ($code: String) {
      merchandise(where: { code: $code }) {
        price
        currency
        state
        comment
        desc
      }
    }
  `

  try {
    const {
      data: { merchandise },
    } = await fireGqlRequest(
      query,
      {
        code,
      },
      apiUrl
    )

    if (merchandise === null) {
      throw new Error(`merchandise with code ${code} is not found`)
    }

    return [
      merchandise.price,
      merchandise.currency,
      merchandise.state,
      merchandise.comment,
      merchandise.desc,
      null,
    ]
  } catch (error) {
    console.error(error)
    return [0, '', '', '', '', error]
  }
}

function getRequestObject(subscription, isPreapproved = false) {
  return {
    body: {
      amount: subscription.amount,
      currency: subscription.currency,
      orderId: subscription.orderNumber,
      packages: [
        {
          id: uuid(),
          amount: subscription.amount,
          products: [
            {
              name: `${subscription.desc} - ${subscription.comment}`,
              quantity: 1,
              price: subscription.amount,
            },
          ],
        },
      ],
      redirectUrls: getRedirectInfo(),
      options: getRequestOption(isPreapproved),
    },
  }
}

function getRedirectInfo() {
  return {
    confirmUrl:
      ENV === 'local'
        ? `http://localhost:3000/subscribe/confirm`
        : `https://${DOMAIN_NAME}/subscribe/confirm`,
    cancelUrl:
      ENV === 'local'
        ? `http://localhost:3000/subscribe/`
        : `https://${DOMAIN_NAME}/subscribe/`,
  }
}

function getRequestOption(isPreapproved) {
  if (isPreapproved) {
    return {
      payment: {
        payType: 'PREAPPROVED',
      },
    }
  } else {
    return {}
  }
}

function constructSubscriptionMutation(payload) {
  const mutationArray = [
    'mutation ($input: subscriptionCreateInput) {',
    'createsubscription(data: $input) {',
  ]

  const payloadField = Object.keys(payload)
  mutationArray.push(...payloadField)

  if (payloadField.includes('createdAt') === false) {
    mutationArray.push('createdAt')
  }

  if (payloadField.includes('id') === false) {
    mutationArray.push('id')
  }

  mutationArray.push('}', '}')

  if (mutationArray.includes('member')) {
    const index = mutationArray.indexOf('member')
    mutationArray.splice(index, 1, 'member { firebaseId }')
  }

  return mutationArray.join('\n')
}

async function createDraftSubscription(createQuery, payload) {
  try {
    const { data } = await fireGqlRequest(
      createQuery,
      {
        input: payload,
      },
      apiUrl
    )
    return data.createsubscription
  } catch (error) {
    console.error(error)
    return null
  }
}

async function updateOrderNumberOfSubscription(subscription) {
  const id = parseInt(subscription.id)
  const orderNumber = createOrderNumberByTaipeiTZ(new Date(), id)

  const updateQuery = `
    mutation ($id: ID!, $orderNumber: String!) {
      updatesubscription(id: $id, data: {orderNumber: $orderNumber}) {
        orderNumber
      }
    }
  `

  try {
    await fireGqlRequest(
      updateQuery,
      {
        id: subscription.id,
        orderNumber,
      },
      apiUrl
    )

    return orderNumber
  } catch (error) {
    console.error(
      `update odernumber to subscription(${subscription.id}) encounter error`
    )
    console.error(error)
    return null
  }
}

async function getPaymentInfo(data, isPreapproved = false) {
  const requestObject = getRequestObject(data, isPreapproved)
  try {
    const res = await linepayClient.request.send(requestObject)
    return res
  } catch (error) {
    console.error(error)
    return null
  }
}

async function createDraftPayment(responseBody, subscription) {
  const mutation = `
    mutation ($input: linepayPaymentCreateInput) {
      createlinepayPayment(data: $input) {
        subscription {
          orderNumber
        }
        transactionTime
        transactionId
        orderId
        amount
        returnCode
        returnMessage
        frequency
      }
    }
  `

  try {
    const { info } = responseBody

    const payload = {
      subscription: {
        connect: {
          orderNumber: subscription.orderNumber,
        },
      },
      transactionId: info.transactionId,
      transactionTime: new Date().toISOString(),
      orderId: subscription.orderNumber,
      amount: subscription.amount,
      returnCode: responseBody.returnCode,
      returnMessage: JSON.stringify(responseBody),
      frequency: subscription.frequency,
    }

    const { data } = await fireGqlRequest(
      mutation,
      {
        input: payload,
      },
      apiUrl
    )
    return data.createlinepayPayment
  } catch (error) {
    console.error(error)
    return null
  }
}

async function getLINEPayInfoOfOneTime(req) {
  const frequency = 'one_time'
  const nextFrequency = 'none'
  const payload = req.body

  const [
    merchandisePrice,
    merchandiseCurrency,
    merchandiseState,
    merchandiesComment,
    merchandiseDesc,
    error,
  ] = await getMerchandiseInfo(frequency)

  if (error) {
    return null
  }

  if (merchandiseState !== 'active') {
    console.error(`frequency(${frequency}) is not active`)
    return null
  }

  payload.frequency = frequency
  payload.nextFrequency = nextFrequency
  payload.amount = merchandisePrice
  payload.currency = merchandiseCurrency
  payload.comment = merchandiesComment
  payload.desc = merchandiseDesc
  payload.orderNumber = 'preparing-order-' + new Date().valueOf()

  // construct GraphQL mutation
  const subsMutation = constructSubscriptionMutation(payload)

  // write draft subscription record to Israfel
  const subscription = await createDraftSubscription(subsMutation, payload)
  if (subscription === null) {
    return null
  }

  // update orderNumber of draft subscription
  const orderNumber = await updateOrderNumberOfSubscription(subscription)
  if (orderNumber === null) {
    return null
  }

  subscription.orderNumber = orderNumber

  // send Request API to LINE Pay server to retreive payment info
  const paymentInfo = await getPaymentInfo(subscription)

  // write draft payment
  const payment = await createDraftPayment(paymentInfo.body, subscription)

  if (payment === null) {
    return null
  } else if (paymentInfo.body.returnCode === '0000') {
    return paymentInfo.body.info
  } else {
    return null
  }
}

async function getLINEPayInfoOfRecurring(req) {
  const payload = req.body
  const { frequency } = payload

  const [
    merchandisePrice,
    merchandiseCurrency,
    merchandiseState,
    merchandiesComment,
    merchandiseDesc,
    error,
  ] = await getMerchandiseInfo(frequency)

  if (error) {
    return null
  }

  if (merchandiseState !== 'active') {
    console.error(`frequency(${frequency}) is not active`)
    return null
  }

  payload.nextFrequency = payload.frequency
  payload.amount = merchandisePrice
  payload.currency = merchandiseCurrency
  payload.comment = merchandiesComment
  payload.desc = merchandiseDesc
  payload.orderNumber = 'preparing-order-' + new Date().valueOf()

  // construct GraphQL mutation
  const subsMutation = constructSubscriptionMutation(payload)

  // write draft subscription record to Israfel
  const subscription = await createDraftSubscription(subsMutation, payload)

  if (subscription === null) {
    return null
  }

  // update orderNumber of draft subscription
  const orderNumber = await updateOrderNumberOfSubscription(subscription)
  if (orderNumber === null) {
    return null
  }

  subscription.orderNumber = orderNumber

  // send Request API to LINE Pay server to retreive payment info
  const paymentInfo = await getPaymentInfo(subscription)

  // write draft payment
  const payment = await createDraftPayment(paymentInfo.body, subscription)

  if (payment === null) {
    return null
  } else if (paymentInfo.body.returnCode === '0000') {
    return paymentInfo.body.info
  } else {
    return null
  }
}

module.exports = async function (req, res) {
  // check request is authenicated
  const isAuthenicated = await verifyRequest(req)

  if (isAuthenicated === false) {
    res.status(401).send()
    return
  }

  const { frequency } = req.query
  switch (frequency) {
    case 'monthly':
    case 'yearly': {
      const recurringResult = await getLINEPayInfoOfRecurring(req)

      if (recurringResult === null) {
        res.status(400).send()
      } else {
        res.status(200).json(recurringResult)
      }

      return
    }
    case 'one_time': {
      const oneTimeResult = await getLINEPayInfoOfOneTime(req)

      if (oneTimeResult === null) {
        res.status(400).send()
      } else {
        res.status(200).json(oneTimeResult)
      }

      return
    }
    default: {
      res.status(400).send()
    }
  }
}
