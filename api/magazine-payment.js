const axios = require('axios')
const { ENV } = require('../configs/config.js')
let DOMAIN = 'payment-dev.mirrormedia.mg'

if (ENV === 'prod') {
  DOMAIN = 'payment-dev.mirrormedia.mg'
} else if (ENV === 'stag') {
  DOMAIN = 'http://payment.mirrormedia.mg'
}

// const { API_TIMEOUT, DOMAIN_NAME } = require('../configs/config.js')

module.exports = async function magazinePayment(req, res) {
  try {
    // const { url: filename } = req
    const apiUrl = `http://${DOMAIN}/mgzsubscribe`
    const payload = JSON.stringify(req.body)

    const { data } = await axios.post(apiUrl, payload)

    res.send(data)
  } catch (err) {
    // res.setHeader('Cache-Control', 'no-store')
    // res.status(500).send(err.message)
    res.send('NONONO付款失敗')
  }
}
