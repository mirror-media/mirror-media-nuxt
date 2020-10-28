const axios = require('axios')

const { API_TIMEOUT, DOMAIN_NAME } = require('../configs/config.js')

module.exports = async function getGcsData(req, res) {
  try {
    const { url: filename } = req
    const apiUrl = `https://${DOMAIN_NAME}/json${filename}.json`
    const { data = {} } = await axios.get(apiUrl, { timeout: API_TIMEOUT })

    res.send(data)
  } catch (err) {
    res.setHeader('Cache-Control', 'no-store')
    res.status(500).send(err.message)
  }
}
