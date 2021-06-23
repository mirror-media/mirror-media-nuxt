const axios = require('axios')

const { ENV } = require('../configs/config.js')
let DOMAIN = 'payment-dev.mirrormedia.mg'

if (ENV === 'prod') {
  DOMAIN = 'payment.mirrormedia.mg'
}

// const { API_TIMEOUT, DOMAIN_NAME } = require('../configs/config.js')

module.exports = async function magazinePayment(req, res) {
  // first post request: to backend
  const payload = JSON.stringify(req.body)

  // fake price for testing
  payload.price_total = 3

  //  get needed key/value from backend
  const response = await axios.post(`http://${DOMAIN}/mgzsubscribe`, payload)
  const newPayloadObject = response.data
  res.send(newPayloadObject)

  // // feed them into a FormData
  // const bodyFormData = new FormData()
  // for (const [key, value] of Object.entries(newPayloadObject)) {
  //   if (key === 'TradeSHA') {
  //     bodyFormData.append('TradeSha', value)
  //   } else {
  //     bodyFormData.append(key, value)
  //   }
  // }

  // const formHeaders = bodyFormData.getHeaders()

  // // second post request: to payment
  // const newResponse = await axios.post(
  //   'https://core.newebpay.com/MPG/mpg_gateway',
  //   bodyFormData,
  //   {
  //     headers: {
  //       ...formHeaders,
  //     },
  //   }
  // )

  // res.send(newResponse?.data)
}
