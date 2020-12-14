const axios = require('axios')
const { API_TIMEOUT } = require('../configs/config')

function createProxy(baseUrl) {
  return async function (req, res, next) {
    try {
      const response = await axios({
        method: req.method,
        url: `${baseUrl}${req.url}`,
        headers: req.headers,
        data: req.method === 'GET' ? undefined : req.body,
        timeout: API_TIMEOUT,
      })

      if (response.data._status === 'ERR') {
        res.setHeader('Cache-Control', 'no-store')
      }
      res.send(response.data)
    } catch (error) {
      res.setHeader('Cache-Control', 'no-store')
      res.status(500).send(error.message)

      // eslint-disable-next-line no-console
      console.error(`[API] url: ${req.url}`, error)
    }
  }
}

module.exports = {
  createProxy,
}
