import axios from 'axios'
// import { print } from 'graphql/language/printer'
// import { fetchPaymentDataOfPapermag } from '../apollo/mutations/papermagSubscriptionMutation.gql'

// import { API_PATH_FRONTEND } from '~/configs/config.js'

// const baseUrl = 'http://localhost:4000/'

// const baseUrl = process.browser
//   ? `${location.origin}/`
//   : 'http://localhost:3000/'
// const apiUrl = `${baseUrl}${API_PATH_FRONTEND}`

async function fireGqlRequest(query, variables) {
  try {
    const { data: result } = await axios({
      url: 'https://dev-israfel-gql.mirrormedia.mg/api/graphql',
      method: 'post',
      data: {
        query,
        variables,
      },
      headers: {
        'content-type': 'application/json',
        'Cache-Control': 'no-store',
      },
    })
    if (result.errors) {
      throw new Error(result.errors[0].message)
    }
    return result
  } catch (error) {
    console.log(error)
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
      ReturnURL
    }
  }
  `
  const data = await fireGqlRequest(fetchPaymentDataOfPapermag, gateWayPayload)
  return data
}

export { getPaymentDataOfPapermagSubscription, fireGqlRequest }
