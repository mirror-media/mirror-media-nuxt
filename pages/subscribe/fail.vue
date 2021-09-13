<template>
  <div>
    <SubscribeStepProgress :currentStep="2" />
    <SubscribeFail
      :resultStatus="resultStatus"
      :orderId="orderId"
      message="訂單建立失敗，請再次下訂單，或來電客服專線 02-6633-3882 協助。"
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
    }
  },
  provide: {
    subscribeFailButtonLink: '/subscribe',
  },
}
</script>
