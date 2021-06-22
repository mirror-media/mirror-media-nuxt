<template>
  <div class="subscribe-magazine-page">
    <SubscribeStepProgress :currentStep="currentStep" />

    <SubscribeChoosePlan v-if="currentStep === 1" :choosePlan="choosePlan" />

    <SubscribeForm
      v-if="
        currentStep === 2 &&
        (orderStatus === 'normal' || orderStatus === 'loading')
      "
      :perchasedPlan="perchasedPlan"
      :proceedOrderPayment="proceedOrderPayment"
      :validateOn="validateOn"
    />

    <SubscribePayment
      v-if="currentStep === 2 && orderStatus === 'payment'"
      :paymentHtml="paymentHtml"
    />

    <SubscribeFail
      v-if="
        currentStep === 2 &&
        (orderStatus === 'order-fail' || orderStatus === 'payment-fail')
      "
      :orderStatus="orderStatus"
      :orderId="orderId"
    />

    <SubscribeSuccess
      v-if="currentStep === 3 && orderStatus === 'success'"
      :orderInfo="orderInfo"
      :orderId="orderId"
    />

    <!-- loading mask -->
    <div
      v-if="orderStatus === 'loading'"
      class="subscribe-magazine-page__loading"
    >
      <div class="subscribe-magazine-page__loading_icon">
        <img :src="require('~/assets/loading.gif')" alt="" />
      </div>
    </div>

    <SubscribeSimFormStatus
      :setSimOrderStatus="setSimOrderStatus"
      :validateOn="validateOn"
      :setValidateOn="setValidateOn"
    />
  </div>
</template>

<script>
import SubscribeStepProgress from '~/components/SubscribeStepProgress.vue'
import SubscribeChoosePlan from '~/components/SubscribeChoosePlan.vue'
import SubscribeForm from '~/components/SubscribeForm.vue'
import SubscribeFail from '~/components/SubscribeFail.vue'
import SubscribeSuccess from '~/components/SubscribeSuccess.vue'
import SubscribeSimFormStatus from '~/components/SubscribeSimFormStatus.vue'
import SubscribePayment from '~/components/SubscribePayment.vue'

export default {
  components: {
    SubscribeStepProgress,
    SubscribeChoosePlan,
    SubscribeForm,
    SubscribeFail,
    SubscribeSuccess,
    SubscribeSimFormStatus,
    SubscribePayment,
  },
  data() {
    return {
      orderId: 'MI100048583',
      currentStep: 2,
      choosedPlanId: 0,
      orderStatus: 'normal', // normal, loading, order-fail, payment-fail, success
      perchasedPlan: [
        {
          id: 0,
          title: '一年方案',
          detail: '一年鏡週刊52期，加購5期方案',
          originalPrice: 3990,
          newPrice: 2880,
          count: this.$route.params.plan === '1' ? 1 : 0,
        },
        {
          id: 1,
          title: '二年方案',
          detail: '二年鏡週刊104期，加購10期方案',
          originalPrice: 7800,
          newPrice: 5280,
          count: this.$route.params.plan === '2' ? 1 : 0,
        },
      ],
      simOrderStatus: 'success', //  order-fail, payment-fail, success
      validateOn: true,
      orderInfo: {},
      paymentHtml: 'Loading',
    }
  },

  methods: {
    choosePlan(choosedPlanId) {
      this.perchasedPlan[choosedPlanId].count++
      this.currentStep++
    },
    async proceedOrderPayment(orderPayload) {
      this.orderInfo = orderPayload
      this.orderStatus = 'loading'
      try {
        const result = await this.payment(orderPayload)
        this.orderStatus = 'payment'
        console.log('付款結束')

        this.paymentHtml = result
        // this.$routter.go('/subscribe-magazine/payment')

        // // payment success
        // this.currentStep++
        // this.orderStatus = 'success'
      } catch (e) {
        // payment fail
        this.orderStatus = e.message
      }
    },
    async payment(orderPayload) {
      try {
        const data = await this.$axios.$post(
          `/api/v2/magazine-payment`,
          orderPayload
        )

        return data
      } catch (err) {
        console.log('有問題啦！')
        console.log(err)
        return new Error('order-fail')
      }
    },
    setSimOrderStatus(val) {
      this.simOrderStatus = val
    },
    setValidateOn() {
      this.validateOn = !this.validateOn
    },
  },
}
</script>

<style lang="scss" scoped>
.subscribe-magazine-page {
  position: relative;
  &__loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    &_icon {
      width: 100px;
      height: 100px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}
</style>
