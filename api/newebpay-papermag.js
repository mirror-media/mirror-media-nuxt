const NewebPay = require('@mirrormedia/newebpay-node')
const {
  NEWEBPAY_PAPERMAG_KEY,
  NEWEBPAY_PAPERMAG_IV,
} = require('../configs/config')

module.exports = async function (req, res) {
  const tradeInfo = req.body
  try {
    const newebpay = new NewebPay(NEWEBPAY_PAPERMAG_KEY, NEWEBPAY_PAPERMAG_IV)

    const encryptPostData = await newebpay.getEncryptedFormPostData(tradeInfo)
    console.log(tradeInfo)

    res.send(encryptPostData)
  } catch (e) {
    res.send(e)
  }
}
