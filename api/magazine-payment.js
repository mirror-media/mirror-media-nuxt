const axios = require('axios')
// const { parse } = require('node-html-parser')

const { ENV } = require('../configs/config.js')
let DOMAIN = 'payment-dev.mirrormedia.mg'

if (ENV === 'prod') {
  DOMAIN = 'payment-dev.mirrormedia.mg'
} else if (ENV === 'stag') {
  DOMAIN = 'http://payment.mirrormedia.mg'
}

// const { API_TIMEOUT, DOMAIN_NAME } = require('../configs/config.js')

module.exports = async function magazinePayment(req, res) {
  // const { url: filename } = req
  const apiUrl = `http://${DOMAIN}/mgzsubscribe`
  const payload = JSON.stringify(req.body)

  const { data } = await axios.post(apiUrl, payload)
  // .then((response) => {
  //   return response
  // console.log(data)
  // const htmlObject = parse(JSON.parse(data))
  // console.log(htmlObject)

  // })

  console.log('data')
  console.log(data)
  res.send('<h1>YOYOYO</h1>')
}
