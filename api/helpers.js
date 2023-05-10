const { default: errors } = require('@twreporter/errors')
const axios = require('axios')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const { createLinePayClient } = require('line-pay-merchant')
const REQUEST_STATUS = require('../constants/request').STATUS
const {
  API_TIMEOUT,
  LINEPAY_CHANNEL_ID,
  LINEPAY_CHANNEL_KEY,
  LINEPAY_CLIENT_MODE,
  GCP_KEYFILE,
} = require('../configs/config')

dayjs.extend(utc)
dayjs.extend(timezone)

const linepayClient = createLinePayClient({
  channelId: LINEPAY_CHANNEL_ID,
  channelSecretKey: LINEPAY_CHANNEL_KEY,
  env: LINEPAY_CLIENT_MODE,
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

/**
 * create custom orderNumber for subscription
 * @param  {Date} date
 * @param  {String} id
 * @return {String} orderNumber
 */
function createOrderNumberByTaipeiTZ(date, id) {
  const time = dayjs(date).tz('Asia/Taipei')
  const prefix = 'M'
  const dateString = time.format('YYMMDD')
  const idString = (id % 10000).toString().padStart(5, '0')
  const orderNumber = `${prefix}${dateString}${idString}`

  return orderNumber
}

/**
 * fire GraphQL request
 * @param  {GraphQLQuery} query
 * @param  {Object} variables
 * @param  {String} apiUrl
 * @return {Object} result
 */
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

/**
 * publish message to designated PubSub topic
 * @param  {String} topicName
 * @param  {String} projectId
 * @param  {Object} message
 * @return {Boolean} success
 */
async function publishMessageToPubSub(topicName, projectId, message) {
  // dynamic import to prevent client side error cause vue component break
  const { PubSub } = await import('@google-cloud/pubsub')

  try {
    const pubsub = new PubSub({
      projectId,
      keyFilename: GCP_KEYFILE,
    })
    const topic = await pubsub.topic(topicName)
    await topic.publishJSON(message.data, message.attributes)
  } catch (error) {
    const annotatingError = errors.helpers.wrap(
      error,
      'PubSub',
      'Encounter error on `publishMessageToPubSub`'
    )

    // eslint-disable-next-line no-console
    console.error(
      JSON.stringify({
        severity: 'CRITICAL',
        message: `Error to publish data to pubsub topic (${topicName})`,
        debugPayload: {
          message,
          error: errors.helpers.printAll(annotatingError, {
            withStack: true,
            withPayload: true,
          }),
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

/**
 * send response with custom paramters
 * @param  {REQUEST_STATUS} { status
 * @param  {HTTP_CODE}        code=200
 * @param  {Object}           data
 * @param  {String}           message
 * @param  {Response}         res }
 */
function sendResponse({ status, code = 200, data, message, res }) {
  switch (status) {
    case REQUEST_STATUS.SUCCESS:
    case REQUEST_STATUS.FAIL: {
      res.status(code).json({
        status,
        data,
      })
      break
    }
    case REQUEST_STATUS.ERROR: {
      res.status(code).json({
        status,
        message,
      })
      break
    }
    default: {
      res.status(500).json({
        status: REQUEST_STATUS.ERROR,
        message: 'Called with invalid status.',
      })
    }
  }
}

module.exports = {
  createProxy,
  createOrderNumberByTaipeiTZ,
  fireGqlRequest,
  linepayClient,
  publishMessageToPubSub,
  sendResponse,
}
