const NewebPay = require('@mirrormedia/newebpay-node')
const { NEWEBPAY_KEY, NEWEBPAY_IV } = require('../configs/config')

module.exports = async function (req, res) {
  const tradeInfo = req.body
  try {
    const newebpay = new NewebPay(NEWEBPAY_KEY, NEWEBPAY_IV)

    const encryptPostData = await newebpay.getEncryptedFormPostData(tradeInfo)

    res.send(encryptPostData)
  } catch (e) {
    res.send(e)
  }
}
