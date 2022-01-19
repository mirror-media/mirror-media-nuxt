<template>
  <div class="subscribe-magazine-page">
    <template v-if="status === 'SUCCESS'">
      <SubscribeStepProgress :currentStep="3" />
      <SubscribeSuccess
        :orderInfo="orderInfo"
        :orderInfoPurchasedList="orderInfoPurchasedList"
        :customerInfo="customerInfo"
      />
    </template>
    <template v-else>
      <SubscribeStepProgress :currentStep="2" />
      <SubscribeFail
        :resultStatus="status"
        :orderId="orderId"
        :errorData="errorData"
      />
    </template>
  </div>
</template>

<script>
import axios from 'axios'
import dayjs from 'dayjs'
import { print } from 'graphql/language/printer'
import SubscribeStepProgress from '~/components/SubscribeStepProgress.vue'
import SubscribeFail from '~/components/SubscribeFail.vue'
import SubscribeSuccess from '~/components/SubscribeSuccess.vue'
import { magazineOrder } from '~/apollo/queries/papermagQuery.gql'
import {
  NEWEBPAY_PAPERMAG_KEY,
  NEWEBPAY_PAPERMAG_IV,
  ISRAFEL_ORIGIN,
} from '~/configs/config'
const NewebPay = require('@mirrormedia/newebpay-node')

export default {
  async asyncData({ req, redirect, route }) {
    if (route.query['order-fail'])
      return {
        status: 'order-fail',
      }
    if (req.method !== 'POST') redirect('/papermag')
    const infoData = req.body
    if (infoData.Status !== 'SUCCESS') {
      return {
        req: infoData,
        status: infoData.Status,
        orderId: infoData.MerchantID,
        errorData: {
          orderId: infoData.MerchantID,
          message: infoData.Status,
        },
      }
    }

    try {
      const newebpay = new NewebPay(NEWEBPAY_PAPERMAG_KEY, NEWEBPAY_PAPERMAG_IV)
      const decryptedTradeInfo = await newebpay.getDecryptedTradeInfo(
        infoData.TradeInfo
      )
      const MerchantOrderNo = JSON.parse(Object.keys(decryptedTradeInfo)[0])
        .Result.MerchantOrderNo

      const { data: result } = await axios({
        url: `${ISRAFEL_ORIGIN}/api/graphql`,
        method: 'post',
        data: {
          query: print(magazineOrder),
          variables: { orderNumber: MerchantOrderNo + '' },
        },
        headers: {
          'content-type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      })
      if (result.errors) console.log(result.errors[0].message)
      const decryptInfoData = result.data.magazineOrder
      console.log({ decryptInfoData })
      const date = dayjs(new Date(decryptInfoData.createdAt)).format(
        'YYYY-MM-DD'
      )

      const shippingCostPerYear = 1040
      let shippingCost = 0
      if (
        decryptInfoData.merchandise.code ===
        'magazine_one_year_with_shipping_fee'
      ) {
        shippingCost = shippingCostPerYear * decryptInfoData.itemCount
      } else if (
        decryptInfoData.merchandise.code ===
        'magazine_two_year_with_shipping_fee'
      ) {
        shippingCost = shippingCostPerYear * decryptInfoData.itemCount * 2
      }

      const orderInfoPurchasedList = [
        {
          text: decryptInfoData.merchandise.name,
          price:
            decryptInfoData.itemCount * decryptInfoData.merchandise.price -
            shippingCost,
        },
        { text: '運費', price: shippingCost },
      ]
      if (decryptInfoData.promoteCode) {
        orderInfoPurchasedList.push({
          text: '折扣碼',
          price: 80 * decryptInfoData.itemCount,
        })
      }
      orderInfoPurchasedList.push({
        text: '付款金額',
        price: decryptInfoData.totalAmount,
      })

      return {
        req: infoData,
        status: infoData.Status,
        orderId: infoData.orderNumber,
        orderInfo: {
          orderId: decryptInfoData.orderNumber,
          date,
          discountPrice: decryptInfoData.promoteCode !== '',
          discount_code: decryptInfoData.promoteCode,
        },
        orderInfoPurchasedList,
        customerInfo: {
          pur_name: decryptInfoData.purchaseName,
          pur_mail: decryptInfoData.purchaseEmail,
          pur_cell: decryptInfoData.purchaseMobile,
          rec_name: decryptInfoData.receiveName,
          rec_cell: decryptInfoData.receiveMobile,
          rec_addr: decryptInfoData.receiveAddress,
        },
      }
    } catch (e) {
      console.log(e)
    }
  },
  components: {
    SubscribeStepProgress,
    SubscribeFail,
    SubscribeSuccess,
  },
  provide: {
    subscribeFailButtonLink: '/papermag',
  },
  data() {
    return {
      req: {},
      status: false,
      orderId: '',
      orderInfo: {},
      orderInfoPurchasedList: [],
      customerInfo: {},
    }
  },
}
</script>

<style lang="scss" scoped>
.return {
  cursor: pointer;
}
</style>
