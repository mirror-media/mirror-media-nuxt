import axios from 'axios'
const NewebPay = require('@mirrormedia/newebpay-node')

const {
  NEWEBPAY_PAPERMAG_KEY,
  NEWEBPAY_PAPERMAG_IV,
  API_PATH_FRONTEND,
} = require('../../configs/config')

const baseUrl = process.browser
  ? `${location.origin}/`
  : 'http://localhost:3000/'
const apiUrl = `${baseUrl}${API_PATH_FRONTEND}`

async function fireGqlRequest(query, variables) {
  try {
    const { data: result } = await axios({
      url: apiUrl,
      // url: 'https://dev-israfel-gql.mirrormedia.mg/api/graphql',
      method: 'post',
      data: {
        query,
        variables: { orderNumber: variables },
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
    throw new Error(error)
  }
}

async function getPaymentDataOfPapermagSubscription(gateWayPayload) {
  const fetchPaymentDataOfPapermag = `
  query($orderNumber: String!) {
    magazineOrder(where: {orderNumber: $orderNumber}){
      id
      orderNumber
      purchaseDatetime
      merchandise {
        name
        price
      }
      itemCount
      totalAmount
      purchaseName
      purchaseEmail
      purchaseMobile
      receiveName
      receiveMobile
      receiveAddress
      createdAt
      totalAmount
    }
  }  
  `
  const { data } = await fireGqlRequest(
    fetchPaymentDataOfPapermag,
    gateWayPayload
  )
  return data
}

module.exports = async function (req, res) {
  const tradeInfo = req.body
  try {
    const newebpay = new NewebPay(NEWEBPAY_PAPERMAG_KEY, NEWEBPAY_PAPERMAG_IV)
    const decryptedTradeInfo = await newebpay.getDecryptedTradeInfo(
      tradeInfo.TradeInfo
    )
    const MerchantOrderNo = JSON.parse(Object.keys(decryptedTradeInfo)[0])
      .Result.MerchantOrderNo
    const data = await getPaymentDataOfPapermagSubscription(
      MerchantOrderNo + ''
    )
    const infoForNewebpay = data.magazineOrder

    res.send(infoForNewebpay)
  } catch (e) {
    console.log(e)
    res.send(e)
  }
}
