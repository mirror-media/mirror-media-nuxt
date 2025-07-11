// import errors from '@twreporter/errors'
const NewebPay = require('@mirrormedia/newebpay-node')
const { NEWEBPAY_KEY, NEWEBPAY_IV } = require('../configs/config')

module.exports = async function (req, res) {
  const tradeInfo = req.body
  try {
    /*
     * 防止使用者自行修改 Amt 的值
     * 詳見：https://app.asana.com/1/614399484723017/project/1210077071799813/task/1210384428427743?focus=true
     */

    let totalPrice = 99999
    const { frequency } = tradeInfo
    switch (frequency) {
      case 'one_time':
        totalPrice = 10
        break
      case 'monthly':
        totalPrice = 99
        break
      case 'yearly':
        totalPrice = 799
        break
      default:
    }

    if (totalPrice !== parseInt(tradeInfo.Amt)) {
      console.log(
        tradeInfo.email,
        `Amt is not correct input, it is ${tradeInfo.Amt} but should be ${totalPrice}`
      )
      throw new Error(`Amt is not correct input`)
    }

    const newebpay = new NewebPay(NEWEBPAY_KEY, NEWEBPAY_IV)
    const encryptPostData = await newebpay.getEncryptedFormPostData(tradeInfo)

    res.send(encryptPostData)
  } catch (e) {
    console.log(tradeInfo.email, 'conter error:', e.message)
    res.status(500).send({
      status: 'error',
      message: e.message,
    })
  }
}
