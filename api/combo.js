const axios = require('axios')

const { API_TIMEOUT, URL_STATIC_COMBO_SECTIONS } = require('../configs/config')
const { NO_CACHE_HEADERS } = require('./constant')

module.exports = async function (req, res, next) {
  if (req.query.endpoint === 'sections') {
    try {
      const response = await axios({
        method: 'get',
        url: URL_STATIC_COMBO_SECTIONS,
        timeout: API_TIMEOUT,
      })

      if (response.data._status === 'ERR') {
        res.set(NO_CACHE_HEADERS)
      }

      res.send({ endpoints: { sections: response.data } })
    } catch (error) {
      console.error(
        '[API](/combo?endpoint=sections) fetch data from static json fail: ',
        error
      )
      next()
    }
  } else {
    next()
  }
}
