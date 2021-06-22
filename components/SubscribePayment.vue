<template>
  <div class="payment-page">
    <form
      name="newebpay"
      id="data_set"
      method="post"
      action="https://core.newebpay.com/MPG/mpg_gateway"
    >
      <input type="hidden" name="MerchantID" value="MS315799494" />
      <input
        type="hidden"
        name="TradeInfo"
        value="1b49c4ad94c5c2fd4639291e2b11ad596cf66eaad7299020bb716a1c005b0a2164bfcc3f577868dbf929c029d5f51ab963a727ec2204175b3655809afe960bdb2f45c73c93c154ba360aba134b1dca1c98c1bef7198e828ef89799d0cced82251ac04dd6b9d0b8bba63244fc066b2b59c1306ca818f9cbf336c05bed47417a89e003b6183af78c29a1a7b0e08562a8d58c73b61ab453ea0374ace086b238ffdfd0a15daf76a9fc1f7756a19e3b9e57963bbe23f3a9e66095268023a2ea8f10a2d2b27ed39c7a5b15bc8b361715f9c532f6ffb56d1a8e73f06f0da1887f9f19b3b281ea27b01ce491463a444e6e7db5c06b08eec97deb3d09b1e76d1e55e8aae171eabf99cd4807f03db036af99b9c8d0c919c87a82a83523e1bac1216774b5e30bc63b8558d1eda7a585b1b523112a671d5ca66ebe3944c01dd82b6015860260571e097a2823f1e9f3bfa05a6147ed314318a30fe27c8158299bc2d7606eba92b5c81941dabb2ba9931612f66069ae9bb11a94384a6c5e78cca64648f1097a75"
      />
      <input
        type="hidden"
        name="TradeSha"
        value="7A20375D0A4796E35D80201EED6A5784A808E04AC173BABC73B085D88488845E"
      />
      <input type="hidden" name="Version" value="1.5" />

      <button>Submit</button>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    paymentPayload: {
      type: Object,
      default: () => {},
    },
  },
  mounted() {
    console.log(this)
    console.log(document.forms.newebpay)
  },
}
</script>

<style lang="scss" scoped>
.payment-page {
  position: relative;
  width: 100%;
  min-height: 50vh;
  button {
    display: none;
  }
}
</style>
