<!-- this page is LINE Pay payment confirmURL -->

<template>
  <div class="subscribe-return">
    <SubscribeStepProgress :currentStep="step" />
    <SubscribeSuccessPage v-if="isSuccessStatus" :orderInfo="orderInfo" />

    <SubscribeInProgressPage
      v-else-if="isInProgressStatus"
      :orderInfo="orderInfo"
    />

    <SubscribeFail v-else category="linepay" />
  </div>
</template>

<script>
import errors from '@twreporter/errors'
import SubscribeSuccessPage from '~/components/SubscribeSuccessPage.vue'
import SubscribeFail from '~/components/SubscribeFail.vue'
import SubscribeStepProgress from '~/components/SubscribeStepProgress.vue'
import SubscribeInProgressPage from '~/components/SubscribeInProgress.vue'
import { RETURN_CODE } from '~/constants/linepay'
import uploadMemberArticleHistory from '~/mixins/upload-member-article-history'

import {
  linepayClient,
  publishMessageToPubSub,
  fireGqlRequest,
} from '~/api/helpers'
import {
  ISRAFEL_ORIGIN,
  PUBSUB_LINEPAY_WEBHOOK_TOPIC_NAME,
  GCP_PROJECT_ID,
} from '~/configs/config'

const TRANSACTION_STATUS = {
  SUCCESS: 'success',
  PROCESSING: 'processing',
  FAIL: 'fail',
}

const shouldNotGoBackStatus = [
  TRANSACTION_STATUS.SUCCESS,
  TRANSACTION_STATUS.PROCESSING,
]

export default {
  middleware: ['handle-go-to-marketing'],
  components: {
    SubscribeStepProgress,
    SubscribeSuccessPage,
    SubscribeInProgressPage,
    SubscribeFail,
  },
  mixins: [uploadMemberArticleHistory],
  async asyncData({ req, redirect }) {
    if (req.method !== 'GET') return redirect('/subscribe')

    if (!process.server) {
      // should execute only on server side
      return
    }

    try {
      // check payment existence and payment status in subscription is valid
      const { orderId = '', transactionId = '' } = req.query
      const query = `
        query fetchSubscriptionByOrderNumberAndTransactionId ($orderId: String!, $transactionId: String!) {
          allSubscriptions(where: {
            AND: [
              { orderNumber: $orderId},
              { linepayPayment_some: {
                transactionId: $transactionId
              }}
            ]
          }) {
            id
            orderNumber
            frequency
            promoteId
            amount
            currency
            linePayStatus
          }
        }
      `

      let queryResult = {}
      try {
        const data = await fireGqlRequest(
          query,
          { orderId, transactionId },
          `${ISRAFEL_ORIGIN}/api/graphql`
        )
        queryResult = data
      } catch (error) {
        throw errors.helpers.wrap(
          new Error(
            'Errors occured while fetching fetchSubscriprion by orderNumber and transactionId.'
          ),
          'GraphQLError',
          'Errors returned in `fetchSubscriptionByOrderNumberAndTransactionId` query',
          { error }
        )
      }

      const {
        data: { allSubscriptions },
      } = queryResult
      if (allSubscriptions === undefined || allSubscriptions.length === 0) {
        return {
          status: TRANSACTION_STATUS.FAIL,
        }
      }

      const subscription = allSubscriptions[0]
      const linePayStatus = subscription.linePayStatus

      /*
       * Redirect to subscribe page when `linePayStatus` of the subscription is not 'paying'
       * This behavior will be triggered when user try to load this page with the same query parameter again.
       */
      if (linePayStatus !== 'paying') {
        return redirect('/subscribe')
      }

      // fire Confrim API request to LINE Pay Server, then push the response to PubSub
      let confirmResult

      try {
        const response = await linepayClient.confirm.send({
          transactionId,
          body: {
            currency: subscription.currency,
            amount: subscription.amount,
          },
        })

        confirmResult = response.body
      } catch (error) {
        const annotatingError = errors.helpers.wrap(
          error,
          'linepayClient',
          'Encounter error on invoking `Confirm API`'
        )

        // eslint-disable-next-line no-console
        console.error(
          JSON.stringify({
            severity: 'ERROR',
            message: errors.helpers.printAll(annotatingError, {
              withStack: true,
              withPayload: true,
            }),
          })
        )

        confirmResult = error.data

        switch (confirmResult.returnCode) {
          case RETURN_CODE.API_CALL_DUPLICATED:
            /*
             * The page should show in-progress messsage and tell user to check payemnt result at member page.
             *
             * If we show 'transaction is failed' in this condition, user will get confused because of inconsistence between
             * multiple tabs.  And user will try to make the same payment request again.
             * So that we might need to make refund to user manaually again.
             */

            return {
              status: TRANSACTION_STATUS.PROCESSING,
              orderInfo: {
                orderId,
              },
            }
          case RETURN_CODE.ORDER_NUMBER_DUPLICATED:
            return {
              status: TRANSACTION_STATUS.FAIL,
            }
          default:
            break
        }
      }

      const payInfo = confirmResult.info?.payInfo[0]

      const message = {
        data: {
          transactionId,
          orderId,
          amount: payInfo?.amount || subscription.amount,
          transactionTime: new Date().toISOString(),
          payInfoMethod: payInfo?.method,
          returnCode: confirmResult.returnCode,
          returnMessage: confirmResult.returnMessage,
          creditCardNickName: payInfo?.creditCardNickname,
          creditCardBrand: payInfo?.creditCardBrand,
          maskedCreditCardNumber: payInfo?.maskedCreditCardNumber,
          regKey: confirmResult.info?.regKey,
        },
        attributes: {
          product: 'premium',
          premiumSubscriptionOrderNumber: subscription.orderNumber,
          premiumSubscriptionFrequency: subscription.frequency,
        },
      }

      const result = await publishMessageToPubSub(
        PUBSUB_LINEPAY_WEBHOOK_TOPIC_NAME,
        GCP_PROJECT_ID,
        message
      )
      if (result === false) {
        throw new Error('Errors occured while publish message to PubSub.')
      }

      // return result and update data attritube
      if (confirmResult.returnCode !== RETURN_CODE.SUCCESS) {
        // Not success
        return {
          status: TRANSACTION_STATUS.FAIL,
        }
      }

      return {
        status: TRANSACTION_STATUS.SUCCESS,
        orderInfo: {
          orderId,
          promoteId: subscription.promoteId,
          frequency: subscription.frequency,
          amount: subscription.amount,
          subscriptionId: subscription.id,
        },
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(
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
      status: TRANSACTION_STATUS.FAIL,
      orderInfo: {},
    }
  },
  computed: {
    step() {
      return shouldNotGoBackStatus.includes(this.status) ? 3 : 2
    },
    isSuccessStatus() {
      return this.status === TRANSACTION_STATUS.SUCCESS
    },
    isInProgressStatus() {
      return this.status === TRANSACTION_STATUS.PROCESSING
    },
  },
}
</script>
