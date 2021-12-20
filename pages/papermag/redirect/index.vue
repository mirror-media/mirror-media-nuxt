<template>
  <div class="redirect-page">
    <NewebpayForm
      :merchantId="paymentPayload.MerchantID"
      :tradeInfo="paymentPayload.TradeInfo"
      :tradeSha="paymentPayload.TradeSha"
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
