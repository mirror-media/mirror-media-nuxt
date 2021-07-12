<template>
  <div class="redirect-page">
    <h1>頁面即將導向藍新支付...</h1>
    <form
      id="data_set"
      name="newebpay"
      method="post"
      action="https://core.newebpay.com/MPG/mpg_gateway"
    >
      <input
        type="hidden"
        name="MerchantID"
        :value="paymentPayload.MerchantID"
      />
      <input type="hidden" name="TradeInfo" :value="paymentPayload.TradeInfo" />
      <input type="hidden" name="TradeSha" :value="paymentPayload.TradeSHA" />
      <input type="hidden" name="Version" :value="paymentPayload.Version" />

      <button>Submit</button>
    </form>
  </div>
</template>

<script>
export default {
  layout: 'empty',
  middleware({ store, redirect }) {
    // block access direct from url
    const isReadyToPay = store.getters['subscribe/isReadyToPay']
    if (!isReadyToPay) {
      redirect('/subscribe')
    }
  },
  computed: {
    paymentPayload() {
      return this.$store.getters['subscribe/getPaymentPayload']
    },
  },
  mounted() {
    // save orderInfo into sessionStorage
    const orderInfo = this.$store.getters['subscribe/getOrderInfo']
    this.storeToSessionStorage('orderInfo', JSON.stringify(orderInfo))

    /*
     * get orderNo and token for this payment
     * save them into sessionStorage
     */
    const { JwtToken, MerchantOrderNo } = this.$store.getters[
      'subscribe/getInfoPayload'
    ]
    this.storeToSessionStorage('JwtToken', JwtToken)
    this.storeToSessionStorage('MerchantOrderNo', MerchantOrderNo)

    // turn off access of this redirect page
    this.$store.dispatch('subscribe/updateReadyToPay', false)

    // submit newebpay form-post to redirect to newebpay page
    const formDOM = document.forms.newebpay
    formDOM.submit()
  },
  methods: {
    storeToSessionStorage(name, value) {
      if (process.browser) {
        sessionStorage.setItem(name, value)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.redirect-page {
  h1 {
    text-align: center;
    font-size: 36px;
  }

  button {
    display: none;
  }
}
</style>
