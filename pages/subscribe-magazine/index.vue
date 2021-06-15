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

export default {
  components: {
    SubscribeStepProgress,
    SubscribeChoosePlan,
    SubscribeForm,
    SubscribeFail,
    SubscribeSuccess,
    SubscribeSimFormStatus,
  },
  data() {
    return {
      orderId: 'MI100048583',
      currentStep: 1,
      choosedPlanId: 0,
      orderStatus: 'normal', // normal, loading, order-fail, payment-fail, success
      perchasedPlan: [
        {
          id: 0,
          title: '一年方案',
          detail: '一年鏡週刊52期，加購5期方案',
          originalPrice: 3990,
          newPrice: 2880,
          count: 0,
        },
        {
          id: 1,
          title: '二年方案',
          detail: '二年鏡週刊104期，加購10期方案',
          originalPrice: 7800,
          newPrice: 5280,
          count: 0,
        },
      ],
      simOrderStatus: 'success', //  order-fail, payment-fail, success
      validateOn: true,
      orderInfo: {},
    }
  },

  methods: {
    choosePlan(choosedPlanId) {
      this.perchasedPlan[choosedPlanId].count++
      this.currentStep++
    },
    async proceedOrderPayment(orderPayload) {
      this.orderInfo = orderPayload
      try {
        await this.payment(orderPayload)
        console.log('付款結束')

        // payment success
        this.currentStep++
        this.orderStatus = 'success'
      } catch (e) {
        // payment fail
        this.orderStatus = e.message
      }
    },
    payment(orderPayload) {
      return new Promise((resolve, reject) => {
        this.orderStatus = 'loading'

        console.log('ready to proceed payment')

        this.$axios
          .$post(`/api/v2/magazine-payment`, orderPayload)
          .then((response) => {
            console.log(response)
            this.$router.resolve(response)
            resolve()
          })
          .catch((err) => {
            console.log(err)
            reject(new Error('order-fail'))
          })
      })
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
