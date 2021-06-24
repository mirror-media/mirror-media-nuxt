const axios = require('axios')

const { ENV } = require('../../configs/config')
let DOMAIN = 'payment-dev.mirrormedia.mg'

if (ENV === 'prod') {
  DOMAIN = 'payment.mirrormedia.mg'
}

module.exports = async function getPaymentInfo(req, res) {
  // first post request: to backend
  const infoPayload = JSON.stringify(req.body)
  //  get needed key/value from backend
  try {
    const response = await axios.post(
      `http://${DOMAIN}/getpaymentresult`,
      infoPayload
    )
    const info = response.data
    res.send(info)
  } catch (e) {
    res.send(e)
  }
}
