import axios from 'axios'
const NewebPay = require('@mirrormedia/newebpay-node')

const {
  NEWEBPAY_PAPERMAG_KEY,
  NEWEBPAY_PAPERMAG_IV,
  ISRAFEL_ORIGIN,
  DOMAIN_NAME,
} = require('../configs/config')

const apiUrl = `${ISRAFEL_ORIGIN}/api/graphql`

async function fireGqlRequest(query, variables) {
  const { data: result } = await axios({
    url: apiUrl,
    method: 'post',
    data: {
      query,
      variables,
    },
    headers: {
      'content-type': 'application/json',
      'Cache-Control': 'no-cache',
    },
  })
  if (result.errors) {
    throw new Error(result.errors[0].message)
  }
  return result
}

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
    gateWayPayload
  )
  data.createNewebpayTradeInfoForMagazineOrder.ReturnURL = `https://${DOMAIN_NAME}/papermag/return`
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
