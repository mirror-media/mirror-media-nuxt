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
      <SubscribeFail category="magazine" />
    </template>
  </div>
</template>

<script>
import axios from 'axios'
import { print } from 'graphql/language/printer'
import { merchandiseWithoutShippingFee } from '~/utils/papermag-merchandise.js'
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
  components: {
    SubscribeStepProgress,
    SubscribeFail,
    SubscribeSuccess,
  },
  async asyncData({ req, redirect }) {
    if (!req) {
      return {
        status: 'order-fail',
      }
    }

    const trace = req.header('X-Cloud-Trace-Context')?.split('/')
    console.log(
      JSON.stringify({
        message: `Request: ${req.method} ${req.originalUrl}`,
        debugPayload: {
          'req.headers': req.headers,
          'req.body': req.body,
        },
        'logging.googleapis.com/trace': `projects/mirrormedia-1470651750304/traces/${trace}`,
      })
    )

    if (req.method !== 'POST') {
      redirect('/papermag')
      return
    }

    if (Object.prototype.hasOwnProperty.call(req.query, 'order-fail')) {
      return {
        status: 'order-fail',
      }
    }

    try {
      const infoData = req.body
      const newebpay = new NewebPay(NEWEBPAY_PAPERMAG_KEY, NEWEBPAY_PAPERMAG_IV)
      const decryptedTradeInfo = await newebpay.getDecryptedTradeInfo(
        infoData.TradeInfo
      )
      const MerchantOrderNo =
        decryptedTradeInfo.Result?.MerchantOrderNo ||
        JSON.parse(Object.keys(decryptedTradeInfo)[0]).Result.MerchantOrderNo

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
      const decryptInfoData = result?.data?.allMagazineOrders[0]
      if (!decryptInfoData) {
        return {
          req: infoData,
          errorData: {
            orderId: '',
            message: '訂單編號不存在',
          },
        }
      }
      if (infoData.Status !== 'SUCCESS') {
        return {
          req: infoData,
          status: infoData.Status,
          errorData: {
            orderId: decryptInfoData.orderNumber,
            message: infoData.Status,
          },
        }
      }

      const { name, shippingFeePerCount } = merchandiseWithoutShippingFee({
        code: decryptInfoData.merchandise.code,
      })
      const shippingCost = shippingFeePerCount * decryptInfoData.itemCount

      const orderInfoPurchasedList = [
        {
          text: name,
          count: decryptInfoData.itemCount,
          price:
            decryptInfoData.itemCount * decryptInfoData.merchandise.price -
            shippingCost,
        },
        { text: '運費', price: shippingCost },
      ]
      if (decryptInfoData.promoteCode) {
        orderInfoPurchasedList.push({
          text: '折扣',
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
        orderInfo: {
          orderId: decryptInfoData.orderNumber,
          date: new Date(decryptInfoData.createdAt),
          discountPrice: decryptInfoData.promoteCode !== '',
          discount_code: decryptInfoData.promoteCode,
        },
        orderInfoPurchasedList,
        customerInfo: {
          pur_name: decryptInfoData.purchaseName,
          pur_mail: decryptInfoData.purchaseEmail,
          pur_cell: decryptInfoData.purchaseMobile,
          pur_addr: decryptInfoData.purchaseAddress,
          rec_name: decryptInfoData.receiveName,
          rec_cell: decryptInfoData.receiveMobile,
          rec_addr: decryptInfoData.receiveAddress,
        },
      }
    } catch (e) {
      console.log(e)
    }
  },
  provide: {
    subscribeFailButtonLink: '/papermag',
  },
  data() {
    return {
      req: {},
      status: 'order-fail',
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
