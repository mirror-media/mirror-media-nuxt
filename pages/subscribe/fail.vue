<template>
  <div>
    <SubscribeStepProgress :currentStep="2" />
    <SubscribeFail
      :resultStatus="resultStatus"
      :orderId="orderId"
      :message="failMessage"
    />
  </div>
</template>

<script>
import { useMemberSubscribeMachine } from '~/xstate/member-subscribe/compositions'
import SubscribeFail from '~/components/SubscribeFail.vue'
import SubscribeStepProgress from '~/components/SubscribeStepProgress.vue'

export default {
  middleware: ['handle-go-to-marketing'],
  setup() {
    const { state, send } = useMemberSubscribeMachine()
    send('付款失敗')
    return {
      stateMembershipSubscribe: state,
      sendMembershipSubscribe: send,
    }
  },
  components: {
    SubscribeFail,
    SubscribeStepProgress,
  },
  data() {
    return {
      orderId: 202012213,
      resultStatus: 'payment-fail',
      isUpgradeFromMonthToYear: true,
    }
  },
  computed: {
    failMessage() {
      if (this.isUpgradeFromMonthToYear) {
        return '變更方案失敗，請重新再試一次，或來電客服專線 02-6633-3966 協助。'
      } else {
        return '訂單建立失敗，請再次下訂單，或來電客服專線 02-6633-3882 協助。'
      }
    },
  },
  provide: {
    subscribeFailButtonLink: '/subscribe',
  },
}
</script>
