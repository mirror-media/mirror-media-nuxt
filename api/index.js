const axios = require('axios')

const {
  API_HOST,
  API_PORT,
  API_PROTOCOL,
  API_TIMEOUT,
} = require('../configs/config')
const { NO_CACHE_HEADERS } = require('./constant')

module.exports = async function (req, res, next) {
  try {
    const response = await axios({
      method: req.method,
      url: `${API_PROTOCOL}://${API_HOST}:${API_PORT}${req.url}`,
      data: req.method === 'GET' ? undefined : req.body,
      timeout: API_TIMEOUT,
    })

    if (response.data._status === 'ERR') {
      res.set(NO_CACHE_HEADERS)
    }
    res.send(response.data)
  } catch (error) {
    res.set(NO_CACHE_HEADERS)
    res.status(500).send(error.message)

    // eslint-disable-next-line no-console
    console.error(`[API] url: ${req.url}`, error)
  }
}
