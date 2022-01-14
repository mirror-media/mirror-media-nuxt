import axios from 'axios'

import { API_PATH_FRONTEND } from '../configs/config.js'

const baseUrl = process.browser
  ? `${location.origin}/`
  : 'http://localhost:3000/'
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
  console.log({ data })
  data.createNewebpayTradeInfoForMagazineOrder.ReturnURL = `${baseUrl}/papermag/return`
  return data
}

export { getPaymentDataOfPapermagSubscription, fireGqlRequest }
