<template>
  <div class="member-subscribe-page">
    <SubscribeStepProgress :currentStep="2" />
    <SubscribeFail
      :resultStatus="'payment-fail'"
      :orderId="'test order number'"
    />
  </div>
</template>

<script>
import SubscribeStepProgress from '~/components/SubscribeStepProgress.vue'
import SubscribeFail from '~/components/SubscribeFail.vue'

export default {
  components: {
    SubscribeStepProgress,
    SubscribeFail,
  },
  provide: {
    subscribeFailButtonLink: '/member-subscribe',
  },
}
</script>

<style lang="scss" scoped></style>
