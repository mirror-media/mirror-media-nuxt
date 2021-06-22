<template>
  <div class="subscribe-magazine-page">
    <template
      v-if="
        currentStep === 2 &&
        (orderStatus === 'order-fail' || orderStatus === 'payment-fail')
      "
    >
      <SubscribeStepProgress
        :currentStep="2"
        v-if="
          currentStep === 2 &&
          (orderStatus === 'order-fail' || orderStatus === 'payment-fail')
        "
      />
      <SubscribeFail :orderStatus="orderStatus" :orderId="orderId" />
    </template>

    <template v-if="currentStep === 3">
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
  components: {
    SubscribeStepProgress,
    SubscribeFail,
    SubscribeSuccess,
  },
  data() {
    return {
      currentStep: 3,
      orderStatus: 'order-fail',
      orderId: 'OOXX',
    }
  },
  computed: {
    orderInfo() {
      return this.$store.getters['subscribe/getOrderInfo']
    },
  },
  mounted() {
    console.log(this.orderInfo)
  },
}
</script>

<style lang="scss" scoped></style>
