<template>
  <div class="subscribe-megazine-page">
    <SubscribeStepProgress :currentStep="currentStep" />

    <SubscribeChoosePlan v-if="currentStep === 1" :choosePlan="choosePlan" />

    <SubscribeForm
      v-if="
        currentStep === 2 &&
        (orderStatus === 'normal' || orderStatus === 'loading')
      "
      :perchasedPlan="perchasedPlan"
      :proceedOrderPayment="proceedOrderPayment"
    />

    <SubscribeFail
      v-if="
        currentStep === 2 &&
        (orderStatus === 'order-fail' || orderStatus === 'payment-fail')
      "
      :orderStatus="orderStatus"
    />

    <SubscribeSuccess v-if="currentStep === 3 && orderStatus === 'success'" />

    <div
      v-if="orderStatus === 'loading'"
      class="subscribe-megazine-page__loading"
    >
      <div class="subscribe-megazine-page__loading_icon">
        <img :src="require('~/assets/loading.gif')" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import SubscribeStepProgress from '~/components/SubscribeStepProgress.vue'
import SubscribeChoosePlan from '~/components/SubscribeChoosePlan.vue'
import SubscribeForm from '~/components/SubscribeForm.vue'
import SubscribeFail from '~/components/SubscribeFail.vue'
import SubscribeSuccess from '~/components/SubscribeSuccess.vue'
export default {
  components: {
    SubscribeStepProgress,
    SubscribeChoosePlan,
    SubscribeForm,
    SubscribeFail,
    SubscribeSuccess,
  },
  data() {
    return {
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
      error: {
        state: '',
        message: '',
      },
    }
  },

  methods: {
    choosePlan(choosedPlanId) {
      this.perchasedPlan[choosedPlanId].count++
      this.currentStep++
    },
    async proceedOrderPayment(newInfo) {
      try {
        await this.payment(newInfo)

        // payment success
        this.currentStep++
        this.orderStatus = 'success'
      } catch (e) {
        // payment fail
        this.error.state = 'payment-fail'
      }
    },
    payment(orderInfo) {
      return new Promise((resolve, reject) => {
        try {
          this.orderStatus = 'loading'

          setTimeout(() => {
            this.orderStatus = 'success'
            resolve()
          }, 3000)
        } catch (e) {
          reject(e)
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.subscribe-megazine-page {
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
