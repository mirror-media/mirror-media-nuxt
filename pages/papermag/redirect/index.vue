<template>
  <div class="redirect-page">
    <NewebpayForm
      :merchantId="paymentPayload.MerchantID"
      :tradeInfo="paymentPayload.TradeInfo"
      :tradeSHA="paymentPayload.TradeSHA"
      :version="paymentPayload.Version"
    />
  </div>
</template>

<script>
import NewebpayForm from '~/components/NewebpayForm.vue'
export default {
  components: {
    NewebpayForm,
  },
  layout: 'empty',
  middleware({ store, redirect }) {
    // block access direct from url
    const isReadyToPay = store.getters['subscribe/isReadyToPay']
    if (!isReadyToPay) {
      redirect('/papermag')
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

<style lang="scss" scoped></style>
