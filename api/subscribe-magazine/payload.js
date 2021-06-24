const axios = require('axios')

const { ENV } = require('../../configs/config')
let DOMAIN = 'payment-dev.mirrormedia.mg'

if (ENV === 'prod') {
  DOMAIN = 'payment.mirrormedia.mg'
}

module.exports = async function getPaymentPayload(req, res) {
  // first post request: to backend
  const payload = JSON.stringify(req.body)

  //  get needed key/value from backend
  const response = await axios.post(`http://${DOMAIN}/mgzsubscribe`, payload)
  const newPayloadObject = response.data
  res.send(newPayloadObject)
}
