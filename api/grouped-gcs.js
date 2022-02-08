const axios = require('axios')

const { API_TIMEOUT, ENV } = require('../configs/config.js')

module.exports = async function getGcsGroupData(req, res) {
  try {
    const { url: filename } = req
    const isStagingOrProd = ENV === 'prod' || ENV === 'staging'
    const path = isStagingOrProd ? 'json' : 'dev'
    const apiUrl = `https://storage.googleapis.com/statics.mirrormedia.mg/${
      path + filename
    }.json`
    const { data = {} } = await axios.get(apiUrl, { timeout: API_TIMEOUT })

    res.send(data)
  } catch (err) {
    res.setHeader('Cache-Control', 'no-store')
    res.status(500).send(err.message)
    console.log(err)
  }
}
