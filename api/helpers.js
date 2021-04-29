const axios = require('axios')
const { API_TIMEOUT } = require('../configs/config')

function createProxy(baseUrl) {
  return async function (req, res) {
    if ((req.url || '').startsWith('/search')) {
      console.log(
        `[Search Log] the incoming request headers is: ${JSON.stringify(
          req.headers
        )}`
      )
      return res.status(500).end('error')
    }

    const headers = Object.assign({}, req.headers)
    delete headers.host

    try {
      const response = await axios({
        method: req.method,
        url: `${baseUrl}${req.url}`,
        headers,
        data: req.method === 'GET' ? undefined : req.body,
        timeout: (req.url || '').startsWith('/search') ? 500 : API_TIMEOUT,
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

module.exports = {
  createProxy,
}
