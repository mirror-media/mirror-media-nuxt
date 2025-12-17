<template>
  <div>
    <SubscribeStepProgress :currentStep="2" />
    <SubscribeFail category="newebpay" />
  </div>
</template>

<script>
import SubscribeFail from '~/components/SubscribeFail.vue'
import SubscribeStepProgress from '~/components/SubscribeStepProgress.vue'

export default {
  middleware: ['handle-go-to-marketing'],
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
  computed: {
    failMessage() {
      return '訂單建立失敗，請再次下訂單，或來電客服專線 02-6633-3882 協助。'
    },
  },
  provide: {
    subscribeFailButtonLink: '/subscribe',
  },
}
</script>
