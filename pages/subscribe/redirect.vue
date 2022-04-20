<template>
  <div class="redirect-page">
    <NewebpayForm
      :merchantId="paymentPayload.MerchantID"
      :tradeInfo="paymentPayload.TradeInfo"
      :tradeSha="paymentPayload.TradeSha"
      :version="paymentPayload.Version"
      :newebpayApiUrl="newebpayApiUrl"
    />
  </div>
</template>

<script>
import { NEWEBPAY_MEMBERSHIP_API_URL } from '~/configs/config.js'
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
      // redirect('/papermag')
    }
  },
  data() {
    return {
      newebpayApiUrl: NEWEBPAY_MEMBERSHIP_API_URL,
    }
  },
  computed: {
    paymentPayload() {
      const queryString = this.$route.query
      return {
        MerchantID: queryString.MerchantID,
        TradeInfo: queryString.TradeInfo,
        TradeSha: queryString.TradeSha,
        Version: parseFloat(queryString.Version),
      }
    },
  },
  mounted() {
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
