const { default: errors } = require('@twreporter/errors')
const axios = require('axios')
const moment = require('moment-timezone')
const { createLinePayClient } = require('line-pay-merchant')
const { PubSub } = require('@google-cloud/pubsub')
const {
  API_TIMEOUT,
  ENV,
  LINEPAY_CHANNEL_ID,
  LINEPAY_CHANNEL_KEY,
} = require('../configs/config')

const linepayClient = createLinePayClient({
  channelId: LINEPAY_CHANNEL_ID,
  channelSecretKey: LINEPAY_CHANNEL_KEY,
  env: ['staging', 'prod'].includes(ENV) ? 'production' : 'development',
})

function createProxy(baseUrl, timeout = API_TIMEOUT) {
  return async function (req, res) {
    const headers = Object.assign({}, req.headers)
    delete headers.host

    try {
      const response = await axios({
        method: req.method,
        url: `${baseUrl}${req.url}`,
        headers,
        data: req.method === 'GET' ? undefined : req.body,
        timeout,
      })

      if (response.data._status === 'ERR') {
        res.setHeader('Cache-Control', 'no-store')
      }
      res.send(response.data)
    } catch (err) {
      res.setHeader('Cache-Control', 'no-store')

      if (err.response) {
        const { status, statusText, headers, data } = err.response

        /*
         * When userDelete's error occurs,
         * need to return detail error message
         * (which is located in err.response.data)
         */
        if (req.url === '/graphql/user') {
          const userErrorDetailMessage = err.response.data
          res.send(userErrorDetailMessage)
        } else {
          res.status(status).send(err.message)
        }

        // eslint-disable-next-line no-console
        console.error(
          `[API Error] statusCode=${status}, statusText=${statusText}, url=${
            req.url
          }, headers=${JSON.stringify(headers)}, data=${JSON.stringify(data)}`
        )
      } else {
        res.status(500).send(err.message)

        // eslint-disable-next-line no-console
        console.error(`[API Error] message=${err.message}, url=${req.url}`)
      }
    }
  }
}

function createOrderNumberByTaipeiTZ(date, id) {
  const time = moment(date).tz('Asia/Taipei')
  const prefix = 'M'
  const dateString = time.format('YYMMDD')
  const idString = (id % 10000).toString().padStart(5, '0')
  const orderNumber = `${prefix}${dateString}${idString}`

  return orderNumber
}

async function fireGqlRequest(query, variables, apiUrl) {
  const { data: result } = await axios({
    url: apiUrl,
    method: 'post',
    data: {
      query,
      variables,
    },
    headers: {
      'content-type': 'application/json',
      'Cache-Control': 'no-cache',
    },
  })
  if (result.errors) {
    throw errors.helpers.wrap(
      new Error(result.errors[0].message),
      'GraphQLError',
      result.errors[0].message,
      { gqlErrors: result.errors[0].data }
    )
  }
  return result
}

async function publishMessageToPubSub(topicName, projectId, message) {
  try {
    const pubsub = new PubSub({
      projectId,
    })
    const topic = await pubsub.topic(topicName)
    await topic.publishJSON(message.data, message.attributes)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      JSON.stringify({
        severity: 'CRITICAL',
        message: `Error to publish data to pubsub topic (${topicName})`,
        debugPayload: {
          message,
        },
      })
    )
    return false
  }

  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify({
      severity: 'INFO',
      message: `publish message to PubSub topic: ${topicName} successfully`,
      debugPayload: {
        message,
      },
    })
  )
  return true
}

module.exports = {
  createProxy,
  createOrderNumberByTaipeiTZ,
  fireGqlRequest,
  linepayClient,
  publishMessageToPubSub,
}
