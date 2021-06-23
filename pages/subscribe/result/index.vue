<template>
  <div class="subscribe-magazine-page">
    <template
      v-if="resultStatus === 'order-fail' || resultStatus === 'payment-fail'"
    >
      <SubscribeStepProgress :currentStep="2" />
      <SubscribeFail :resultStatus="resultStatus" :orderId="orderId" />
    </template>

    <template v-if="resultStatus === 'success'">
      <SubscribeStepProgress :currentStep="3" />
      <SubscribeSuccess :orderInfo="orderInfo" :orderId="orderId" />
    </template>
  </div>
</template>

<script>
import SubscribeStepProgress from '~/components/SubscribeStepProgress.vue'
import SubscribeFail from '~/components/SubscribeFail.vue'
import SubscribeSuccess from '~/components/SubscribeSuccess.vue'
export default {
  // middleware({ store, redirect }) {
  //   const resultStatus = store.getters['subscribe/getResultStatus']
  //   if (
  //     resultStatus !== 'success' &&
  //     resultStatus !== 'order-fail' &&
  //     resultStatus !== 'payment-fail'
  //   ) {
  //     redirect('/subscribe')
  //   }
  // },
  components: {
    SubscribeStepProgress,
    SubscribeFail,
    SubscribeSuccess,
  },
  data() {
    return {
      currentStep: 3,
      orderId: 'OOXX',
    }
  },
  computed: {
    resultStatus() {
      return this.$store.getters['subscribe/getResultStatus']
    },
    orderInfo() {
      return this.$store.getters['subscribe/getOrderInfo']
    },
  },
}
</script>

<style lang="scss" scoped></style>
