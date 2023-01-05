<template>
  <div class="subscribe-return">
    <SubscribeStepProgress :currentStep="step" />
    <SubscribeSuccessPage v-if="status === 'success'" :orderInfo="orderInfo" />
    <SubscribeFail v-else category="newebpay" />
  </div>
</template>

<script>
import axios from 'axios'
import errors from '@twreporter/errors'
import SubscribeSuccessPage from '~/components/SubscribeSuccessPage.vue'
import SubscribeFail from '~/components/SubscribeFail.vue'
import SubscribeStepProgress from '~/components/SubscribeStepProgress.vue'
import { NEWEBPAY_KEY, NEWEBPAY_IV, ISRAFEL_ORIGIN } from '~/configs/config'
import uploadMemberArticleHistory from '~/mixins/upload-member-article-history'
const NewebPay = require('@mirrormedia/newebpay-node')

export default {
  middleware: ['handle-go-to-marketing'],
  components: {
    SubscribeStepProgress,
    SubscribeSuccessPage,
    SubscribeFail,
  },
  mixins: [uploadMemberArticleHistory],
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
      const MerchantOrderNo =
        decryptedTradeInfo.Result?.MerchantOrderNo ||
        JSON.parse(Object.keys(decryptedTradeInfo)[0]).Result.MerchantOrderNo

      const query = `query fetchSubscriprionByOrderNumber($orderNumber: String) {
        allSubscriptions(
          where: {
          orderNumber: $orderNumber
        }
        ) {
          id
          orderNumber
          frequency
          periodCreateDatetime
          periodFirstDatetime
          periodEndDatetime
          promoteId
          amount
        }
      }`

      let result = {}

      try {
        const axiosRes = await axios({
          url: `${ISRAFEL_ORIGIN}/api/graphql`,
          method: 'post',
          data: {
            query,
            variables: { orderNumber: MerchantOrderNo },
          },
          headers: {
            'content-type': 'application/json',
            'Cache-Control': 'no-cache',
          },
        })
        result = axiosRes.data
      } catch (e) {
        throw errors.helpers.annotateAxiosError(e)
      }

      if (result.errors) {
        throw new Error(
          errors.helpers.wrap(
            new Error(
              'Errors occured while fetching fetchSubscriprion by orderNumber.'
            ),
            'GraphQLError',
            'Errors returned in `fetchSubscriprionByOrderNumber` query',
            { gqlErrors: result.errors }
          )
        )
      }

      const decryptInfoData = result?.data?.allSubscriptions[0]

      if (!decryptInfoData?.id) {
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
          amount: decryptInfoData.amount,
          subscriptionId: decryptInfoData.id,
        },
      }
    } catch (e) {
      console.log(
        JSON.stringify({
          severity: 'ERROR',
          message: errors.helpers.printAll(e, {
            withStack: true,
            withPayload: true,
          }),
        })
      )
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
