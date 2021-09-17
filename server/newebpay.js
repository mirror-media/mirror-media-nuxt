const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const NewebPay = require('@mirrormedia/newebpay-node')
const { NEWEBPAY_KEY, NEWEBPAY_IV } = require('../configs/config')

// 為了測試通過而保留，在 server/index.js 已設定
router.use(bodyParser.json())

router.post('/encrypt', function (req, res, next) {
  const tradeInfo = req.body

  try {
    const newebpay = new NewebPay(NEWEBPAY_KEY, NEWEBPAY_IV)

    const encryptPostData = newebpay.getEncryptedFormPostData(tradeInfo)

    res.send(encryptPostData)
  } catch (e) {
    next(e)
  }
})

module.exports = router
