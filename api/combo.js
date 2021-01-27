const axios = require('axios')

const { API_TIMEOUT, URL_STATIC_COMBO_SECTIONS } = require('../configs/config')

module.exports = async function (req, res, next) {
  if (req.query.endpoint === 'sections') {
    try {
      const response = await axios({
        method: 'get',
        url: URL_STATIC_COMBO_SECTIONS,
        timeout: API_TIMEOUT,
      })

      res.send({ endpoints: { sections: response.data } })
    } catch (err) {
      if (err.response) {
        const { status, statusText, headers, data } = err.response

        // eslint-disable-next-line no-console
        console.error(
          `[API Combo Error] statusCode=${status}, statusText=${statusText}, url=${URL_STATIC_COMBO_SECTIONS}, headers=${JSON.stringify(
            headers
          )}, data=${JSON.stringify(data)}`
        )
      } else {
        // eslint-disable-next-line no-console
        console.error(
          `[API Combo Error] message=${err.message}, url=${URL_STATIC_COMBO_SECTIONS}`
        )
      }

      next()
    }
  } else {
    next()
  }
}
