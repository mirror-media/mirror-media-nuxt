<!-- this page is LINE Pay payment confirmURL -->

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
import errors from '@twreporter/errors'
import SubscribeSuccessPage from '~/components/SubscribeSuccessPage.vue'
import SubscribeFail from '~/components/SubscribeFail.vue'
import SubscribeStepProgress from '~/components/SubscribeStepProgress.vue'

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

export default {
  middleware: ['handle-go-to-marketing'],
  components: {
    SubscribeStepProgress,
    SubscribeSuccessPage,
    SubscribeFail,
  },
  async asyncData({ req, redirect }) {
    if (req.method !== 'GET') return redirect('/subscribe')

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
            periodCreateDatetime
            periodFirstDatetime
            periodEndDatetime
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

      const { allSubscriptions } = queryResult
      if (allSubscriptions === undefined || allSubscriptions.length === 0) {
        return {
          status: 'fail',
          errorData: {
            message: 'linepay-fail',
          },
        }
      }

      const subscription = allSubscriptions[0]
      const status = subscription.linePayStatus

      switch (status) {
        case 'paying': {
          break
        }
        case 'paid': {
          // show success page even if requesting with same transactionId and orderId again
          return {
            status: 'success',
            orderInfo: {
              orderId,
              promoteId: subscription.promoteId,
              frequency: subscription.frequency,
            },
          }
        }
        default: {
          return {
            status: 'fail',
            errorData: {
              message: 'linepay-fail',
            },
          }
        }
      }

      // fire Confrim API request to LINE Pay Server, then push the response to PubSub
      const { body: confirmResult } = await linepayClient.confirm.send({
        transactionId,
        body: {
          currency: subscription.currency,
          amount: subscription.amount,
        },
      })

      const message = {
        data: {
          subscription,
          confirm: confirmResult,
        },
        attributes: {
          product: 'premium',
          transactionId,
          orderId,
          frequency: subscription.frequency,
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
      return {
        status: 'success',
        orderInfo: {
          orderId,
          promoteId: subscription.promoteId,
          frequency: subscription.frequency,
        },
      }
    } catch (e) {
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
