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
import {
  verifyTradeSha,
  parseNewebpayCallback,
  getOrderBindingSecret,
  isOrderBoundToRequest,
} from '~/api/newebpay-helpers'
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
    const log = (message, severity = 'INFO') =>
      console.log(
        JSON.stringify({
          severity,
          message,
          'logging.googleapis.com/trace': `projects/mirrormedia-1470651750304/traces/${trace}`,
        })
      )

    // TradeInfo / TradeSha 不進 log，避免被拿去重放
    log(`Request: ${req.method} ${req.originalUrl} Status=${req.body?.Status}`)

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
      if (
        !verifyTradeSha(
          infoData.TradeInfo,
          infoData.TradeSha,
          NEWEBPAY_PAPERMAG_KEY,
          NEWEBPAY_PAPERMAG_IV
        )
      ) {
        log('papermag return rejected: TradeSha mismatch', 'WARNING')
        return { status: 'order-fail' }
      }

      const newebpay = new NewebPay(NEWEBPAY_PAPERMAG_KEY, NEWEBPAY_PAPERMAG_IV)
      const callback = parseNewebpayCallback(
        await newebpay.getDecryptedTradeInfo(infoData.TradeInfo)
      )
      if (!callback) {
        log(
          'papermag return rejected: TradeInfo is not a NewebPay result',
          'WARNING'
        )
        return { status: 'order-fail' }
      }
      const MerchantOrderNo = callback.merchantOrderNo

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
          errorData: {
            orderId: '',
            message: '訂單編號不存在',
          },
        }
      }
      if (callback.status !== 'SUCCESS') {
        return {
          status: callback.status,
          errorData: {
            orderId: decryptInfoData.orderNumber,
            message: callback.status,
          },
        }
      }

      /*
       * TradeSha 只能證明這筆 TradeInfo 是藍新簽的，擋不了拿別人的結果頁 POST 重放。
       * 個資只給下單時拿到綁定 cookie 的那個瀏覽器看，其他情況只顯示訂單與金額。
       */
      const isOrderBound = isOrderBoundToRequest(
        req.headers.cookie,
        MerchantOrderNo,
        getOrderBindingSecret(NEWEBPAY_PAPERMAG_KEY, NEWEBPAY_PAPERMAG_IV)
      )
      if (!isOrderBound) {
        log(
          `papermag return: order ${MerchantOrderNo} not bound to this browser, customer info hidden`,
          'WARNING'
        )
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
        status: callback.status,
        orderInfo: {
          orderId: decryptInfoData.orderNumber,
          date: new Date(decryptInfoData.createdAt),
          discountPrice: decryptInfoData.promoteCode !== '',
          discount_code: decryptInfoData.promoteCode,
        },
        orderInfoPurchasedList,
        customerInfo: isOrderBound
          ? {
              pur_name: decryptInfoData.purchaseName,
              pur_mail: decryptInfoData.purchaseEmail,
              pur_cell: decryptInfoData.purchaseMobile,
              pur_addr: decryptInfoData.purchaseAddress,
              rec_name: decryptInfoData.receiveName,
              rec_cell: decryptInfoData.receiveMobile,
              rec_addr: decryptInfoData.receiveAddress,
            }
          : {},
      }
    } catch (e) {
      log(`papermag return error: ${e.message}`, 'ERROR')
    }
  },
  provide: {
    subscribeFailButtonLink: '/papermag',
  },
  data() {
    return {
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
