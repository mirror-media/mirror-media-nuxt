<template>
  <div>
    <SubscribeStepProgress :currentStep="2" />
    <AnniversaryModal :isSubscribe="true" />
    <SubscribeFail category="newebpay" />
  </div>
</template>

<script>
import SubscribeFail from '~/components/SubscribeFail.vue'
import SubscribeStepProgress from '~/components/SubscribeStepProgress.vue'
import AnniversaryModal from '~/components/AnniversaryModal.vue'

export default {
  middleware: ['handle-go-to-marketing'],
  components: {
    SubscribeFail,
    SubscribeStepProgress,
    AnniversaryModal,
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
