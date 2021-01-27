const axios = require('axios')
const { API_TIMEOUT } = require('../configs/config')

function createProxy(baseUrl) {
  return async function (req, res) {
    const headers = Object.assign({}, req.headers)
    delete headers.host

    try {
      const response = await axios({
        method: req.method,
        url: `${baseUrl}${req.url}`,
        headers,
        data: req.method === 'GET' ? undefined : req.body,
        timeout: API_TIMEOUT,
      })

      if (response.data._status === 'ERR') {
        res.setHeader('Cache-Control', 'no-store')
      }
      res.send(response.data)
    } catch (err) {
      res.setHeader('Cache-Control', 'no-store')

      if (err.response) {
        const { status, statusText, headers, data } = err.response

        res.status(status).send(err.message)

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
