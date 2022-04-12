<template>
  <div class="subscribe-return">
    <SubscribeStepProgress :currentStep="step" />
    <SubscribeSuccessPage v-if="status === 'success'" :orderInfo="orderInfo" />
    <SubscribeFail
      v-else
      :resultStatus="status"
      :orderId="errorData.orderId"
      :message="errorData.message"
    />
  </div>
</template>

<script>
import axios from 'axios'
import errors from '@twreporter/errors'
import { print } from 'graphql/language/printer'
import SubscribeSuccessPage from '~/components/SubscribeSuccessPage.vue'
import SubscribeFail from '~/components/SubscribeFail.vue'
import SubscribeStepProgress from '~/components/SubscribeStepProgress.vue'
import { NEWEBPAY_KEY, NEWEBPAY_IV, ISRAFEL_ORIGIN } from '~/configs/config'
import { fetchSubscriprionByOrderNumber } from '~/apollo/queries/memberSubscriptionQuery.gql'
const NewebPay = require('@mirrormedia/newebpay-node')

export default {
  middleware: ['handle-go-to-marketing'],
  components: {
    SubscribeStepProgress,
    SubscribeSuccessPage,
    SubscribeFail,
  },
  async asyncData({ req, redirect }) {
    if (req.method !== 'POST') return redirect('/subscribe')

    try {
      const infoData = req.body
      if (infoData.Status !== 'SUCCESS') {
        return {
          status: infoData.Status,
          errorData: {
            message: infoData.Status,
          },
        }
      }

      const newebpay = new NewebPay(NEWEBPAY_KEY, NEWEBPAY_IV)
      const decryptedTradeInfo = await newebpay.getDecryptedTradeInfo(
        infoData.TradeInfo
      )
      const MerchantOrderNo = JSON.parse(Object.keys(decryptedTradeInfo)[0])
        .Result.MerchantOrderNo

      const { data: result } = await axios({
        url: `${ISRAFEL_ORIGIN}/api/graphql`,
        method: 'post',
        data: {
          query: print(fetchSubscriprionByOrderNumber),
          variables: { orderNumber: MerchantOrderNo },
        },
        headers: {
          'content-type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      })
      if (result.errors) throw new Error(result.errors[0].message)
      const decryptInfoData = result?.data?.allSubscriptions[0]

      if (!decryptInfoData.id) {
        return {
          errorData: {
            orderId: '',
            message: '訂單編號不存在',
          },
        }
      }

      return {
        status: 'success',
        orderInfo: {
          orderId: decryptInfoData.orderNumber,
          promoteId: decryptedTradeInfo.promoteId,
          frequency: decryptInfoData.frequency,
        },
      }
    } catch (e) {
      if (e.stack) {
        console.log(
          JSON.stringify({
            severity: 'ERROR',
          })
        )
      } else {
        const annotatingError = errors.helpers.annotateAxiosError(e)
        console.log(
          JSON.stringify({
            severity: 'ERROR',
            message: errors.helpers.printAll(annotatingError, {
              withStack: true,
              withPayload: true,
            }),
          })
        )
      }
    }
  },
  data() {
    return {
      status: 'fail',
      errorData: {},
      orderInfo: {},
    }
  },
  computed: {
    step() {
      return this.status === 'success' ? 3 : 2
    },
  },
}
</script>