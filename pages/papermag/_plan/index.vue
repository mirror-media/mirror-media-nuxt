<template>
  <div class="subscribe-magazine-page">
    <SubscribeStepProgress :currentStep="2" />

    <SubscribeForm
      :currentChoosedPlanId="currentChoosedPlanId"
      :proceedOrderPayment="proceedOrderPayment"
      :validateOn="validateOn"
    />

    <!-- loading mask -->
    <div v-if="isLoading" class="subscribe-magazine-page__loading">
      <div class="subscribe-magazine-page__loading_icon">
        <img :src="require('~/assets/loading.gif')" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import qs from 'qs'
import SubscribeStepProgress from '~/components/SubscribeStepProgress.vue'
import SubscribeForm from '~/components/SubscribeForm.vue'

export default {
  components: {
    SubscribeStepProgress,
    SubscribeForm,
  },
  middleware({ route, redirect }) {
    if (
      process.server &&
      route.params.plan !== '1' &&
      route.params.plan !== '2'
    ) {
      redirect(`/papermag`)
    }
  },
  data() {
    return {
      isLoading: false,
      validateOn: true,
    }
  },
  computed: {
    currentChoosedPlanId() {
      const plan = this.$route.params.plan
      return parseInt(plan) - 1
    },
  },
  methods: {
    async proceedOrderPayment(orderPayload) {
      if (this.isLoading) return
      try {
        this.isLoading = true
        const tradeInfo = orderPayload
        const encryptPaymentPayload = await this.$axios.$post(
          `${window.location.origin}/api/v2/newebpay-papermag/v1`,
          tradeInfo
        )

        // carry encrypted paymentPayload to redirect page
        const queryString = qs.stringify(encryptPaymentPayload)
        this.$router.push(`/papermag/redirect?${queryString}`)
        this.isLoading = false
      } catch (err) {
        console.error(err)

        // payment fail
        this.$store.dispatch('subscribe/updateResultStatus', 'order-fail')
        this.$router.push(`/papermag/result`)
      }
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
    z-index: 200;
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
