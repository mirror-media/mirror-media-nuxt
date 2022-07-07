import { fireGqlRequest } from './helpers'
const NewebPay = require('@mirrormedia/newebpay-node')

const {
  NEWEBPAY_PAPERMAG_KEY,
  NEWEBPAY_PAPERMAG_IV,
  ISRAFEL_ORIGIN,
  DOMAIN_NAME,
  ENV,
} = require('../configs/config')

const apiUrl = `${ISRAFEL_ORIGIN}/api/graphql`

async function getPaymentDataOfPapermagSubscription(gateWayPayload) {
  const fetchPaymentDataOfPapermag = `mutation fetchPaymentDataOfPapermag(
    $data: createNewebpayTradeInfoForMagazineOrderInput!
  ) {
    createNewebpayTradeInfoForMagazineOrder(data: $data) {
      MerchantID
      RespondType
      TimeStamp
      Version
      MerchantOrderNo
      Amt
      ItemDesc
      LoginType
      Email
      TradeLimit
      NotifyURL
    }
  }
  `
  const { data } = await fireGqlRequest(
    fetchPaymentDataOfPapermag,
    gateWayPayload,
    apiUrl
  )
  data.createNewebpayTradeInfoForMagazineOrder.ReturnURL =
    ENV === 'local'
      ? `http://localhost:3000/papermag/return`
      : `https://${DOMAIN_NAME}/papermag/return`
  return data
}

module.exports = async function (req, res) {
  const tradeInfo = req.body
  try {
    const data = await getPaymentDataOfPapermagSubscription(tradeInfo)
    const infoForNewebpay = data.createNewebpayTradeInfoForMagazineOrder

    const newebpay = new NewebPay(NEWEBPAY_PAPERMAG_KEY, NEWEBPAY_PAPERMAG_IV)
    const encryptPostData = await newebpay.getEncryptedFormPostData(
      infoForNewebpay
    )

    console.log(
      JSON.stringify({
        message: `papermag payload:`,
        debugPayload: {
          'req.body': req.body,
        },
        'logging.googleapis.com/trace': `projects/mirrormedia-1470651750304/traces/papermag`,
      })
    )

    res.send({
      status: 'success',
      data: encryptPostData,
    })
  } catch (e) {
    console.log(e)
    res.status(500).send({
      status: 'error',
      message: e.message,
    })
  }
}
