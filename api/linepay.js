import express from 'express'
import uuid from 'uuid/v4'
import errors from '@twreporter/errors'
import { ENV, DOMAIN_NAME, ISRAFEL_ORIGIN } from '../configs/config.js'
import requestAuthentication from '../serverMiddleware/requestAuthentication.js'
import {
  createOrderNumberByTaipeiTZ,
  fireGqlRequest,
  linepayClient,
} from './helpers'

const apiUrl = `${ISRAFEL_ORIGIN}/api/graphql`

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
    ]
  } catch (error) {
    throw errors.helpers.wrap(
      error,
      'FunctionError',
      'error on getting merchandise info',
      { error }
    )
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
  const mutation = `
mutation ($input: subscriptionCreateInput) {
  createsubscription(data: $input) {
    ${(function () {
      const payloadField = Object.keys(payload)

      if (payloadField.includes('createdAt') === false) {
        payloadField.push('createdAt')
      }

      if (payloadField.includes('id') === false) {
        payloadField.push('id')
      }

      if (payloadField.includes('member')) {
        const index = payloadField.indexOf('member')
        payloadField.splice(index, 1, 'member { firebaseId }')
      }

      return payloadField.join('\n')
    })()}
  }
}`

  return mutation
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
    throw errors.helpers.wrap(
      error,
      'FunctionError',
      'error on creating draft subscription',
      { error }
    )
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
    throw errors.helpers.wrap(
      error,
      'FunctionError',
      `update odernumber to subscription(${subscription.id}) encounter error`,
      { error }
    )
  }
}

async function getPaymentInfo(data, isPreapproved = false) {
  const requestObject = getRequestObject(data, isPreapproved)
  try {
    const res = await linepayClient.request.send(requestObject)
    return res
  } catch (error) {
    throw errors.helpers.wrap(
      error,
      'ApiError',
      'error on getting LINEPay payment info',
      { error }
    )
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
      transactionId: info?.transactionId,
      transactionTime: new Date().toISOString(),
      orderId: subscription.orderNumber,
      amount: subscription.amount,
      returnCode: responseBody.returnCode,
      returnMessage: responseBody.returnMessage,
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
    throw errors.helpers.wrap(
      error,
      'FunctionError',
      'error on creating draft LINEPay payment',
      { error }
    )
  }
}

async function getLINEPayInfoOfOneTime(req) {
  const frequency = 'one_time'
  const nextFrequency = 'none'
  const payload = req.body

  try {
    const [
      merchandisePrice,
      merchandiseCurrency,
      merchandiseState,
      merchandiesComment,
      merchandiseDesc,
    ] = await getMerchandiseInfo(frequency)

    if (merchandiseState !== 'active') {
      // eslint-disable-next-line no-console
      console.log(
        JSON.stringify({
          severity: 'INFO',
          message: `frequency(${frequency}) is not active`,
        })
      )
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

    // update orderNumber of draft subscription
    const orderNumber = await updateOrderNumberOfSubscription(subscription)
    subscription.orderNumber = orderNumber

    // send Request API to LINE Pay server to retreive payment info
    const paymentInfo = await getPaymentInfo(subscription)

    // write draft payment
    await createDraftPayment(paymentInfo.body, subscription)

    if (paymentInfo.body.returnCode === '0000') {
      return paymentInfo.body.info
    } else {
      return null
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      JSON.stringify({
        severity: 'ERROR',
        message: error.message,
        debugPayload: {
          error: errors.helpers.printAll(error, {
            withStack: true,
            withPayload: true,
          }),
        },
      })
    )
    return null
  }
}

async function getLINEPayInfoOfRecurring(req) {
  const payload = req.body
  const { frequency } = payload

  try {
    const [
      merchandisePrice,
      merchandiseCurrency,
      merchandiseState,
      merchandiesComment,
      merchandiseDesc,
    ] = await getMerchandiseInfo(frequency)

    if (merchandiseState !== 'active') {
      // eslint-disable-next-line no-console
      console.log(
        JSON.stringify({
          severity: 'INFO',
          message: `frequency(${frequency}) is not active`,
        })
      )
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

    // update orderNumber of draft subscription
    const orderNumber = await updateOrderNumberOfSubscription(subscription)
    subscription.orderNumber = orderNumber

    // send Request API to LINE Pay server to retreive payment info
    const paymentInfo = await getPaymentInfo(subscription)

    // write draft payment
    await createDraftPayment(paymentInfo.body, subscription)

    if (paymentInfo.body.returnCode === '0000') {
      return paymentInfo.body.info
    } else {
      return null
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      JSON.stringify({
        severity: 'ERROR',
        message: errors.helpers.printAll(error, {
          withStack: true,
          withPayload: true,
        }),
      })
    )
    return null
  }
}

const app = express()
app.use(requestAuthentication())

app.post('/', async (req, res) => {
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
})

module.exports = app
