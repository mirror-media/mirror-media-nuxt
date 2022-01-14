import axios from 'axios'
const NewebPay = require('@mirrormedia/newebpay-node')

const {
  NEWEBPAY_PAPERMAG_KEY,
  NEWEBPAY_PAPERMAG_IV,
  API_PATH_FRONTEND,
} = require('../configs/config')

const baseUrl = location.origin
const apiUrl = `${baseUrl}${API_PATH_FRONTEND}`

async function fireGqlRequest(query, variables) {
  try {
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
  } catch (error) {
    console.log(error.message)
    throw new Error(error.message)
  }
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
  data.createNewebpayTradeInfoForMagazineOrder.ReturnURL = `${baseUrl}/papermag/return`
  return data
}

export { getPaymentDataOfPapermagSubscription, fireGqlRequest }

module.exports = async function (req, res) {
  const tradeInfo = req.body
  try {
    const data = await getPaymentDataOfPapermagSubscription(tradeInfo)
    const infoForNewebpay = data.createNewebpayTradeInfoForMagazineOrder

    const newebpay = new NewebPay(NEWEBPAY_PAPERMAG_KEY, NEWEBPAY_PAPERMAG_IV)
    const encryptPostData = await newebpay.getEncryptedFormPostData(
      infoForNewebpay
    )

    res.send(encryptPostData)
  } catch (e) {
    res.send(e)
  }
}
