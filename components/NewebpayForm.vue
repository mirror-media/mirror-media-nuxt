<template>
  <div class="newebpay-form">
    <h1>頁面即將導向藍新支付...</h1>
    <form
      id="data_set"
      name="newebpay"
      method="post"
      action="https://core.newebpay.com/MPG/mpg_gateway"
    >
      <input type="hidden" name="MerchantID" :value="merchantId" />
      <input type="hidden" name="TradeInfo" :value="tradeInfo" />
      <input type="hidden" name="TradeSha" :value="tradeSHA" />
      <input type="hidden" name="Version" :value="version" />

      <button>Submit</button>
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
    tradeSHA: {
      type: String,
      isRequired: true,
      default: '',
    },
    version: {
      type: Number,
      isRequired: true,
      default: 1.6,
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
