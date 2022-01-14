<template>
  <div class="newebpay-form">
    <h1>頁面即將導向藍新支付...</h1>
    <form id="data_set" name="newebpay" method="post" :action="newebpayApiUrl">
      <input type="hidden" name="MerchantID" :value="merchantId" />
      <input type="hidden" name="TradeInfo" :value="tradeInfo" />
      <input type="hidden" name="TradeSha" :value="tradeSha" />
      <input type="hidden" name="Version" :value="version" />

      <button>Submit</button>
    </form>
  </div>
</template>

<script>
import { ENV } from '../configs/config'

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
  },
  data() {
    return {
      newebpayApiUrl:
        ENV === 'prod'
          ? 'https://core.newebpay.com/MPG/mpg_gateway'
          : 'https://ccore.newebpay.com/MPG/mpg_gateway',
    }
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
