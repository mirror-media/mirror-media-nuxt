<template>
  <div class="newebpay-form">
    <form id="data_set" name="newebpay" method="post" :action="newebpayApiUrl">
      <input type="hidden" name="MerchantID" :value="merchantId" />
      <input type="hidden" name="TradeInfo" :value="tradeInfo" />
      <input type="hidden" name="TradeSha" :value="tradeSha" />
      <input type="hidden" name="Version" :value="version" />

      <button type="hidden">Submit</button>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    merchantId: {
      type: String,
      isRequired: true,
      default: '',
    },
    tradeInfo: {
      type: String,
      isRequired: true,
      default: '',
    },
    tradeSha: {
      type: String,
      isRequired: true,
      default: '',
    },
    version: {
      type: String,
      isRequired: true,
      default: '1.6',
    },
    newebpayApiUrl: {
      type: String,
      default: 'https://ccore.newebpay.com/MPG/mpg_gateway',
      isRequired: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.newebpay-form {
  h1 {
    text-align: center;
    font-size: 36px;
  }

  button {
    display: none;
  }
}
</style>
