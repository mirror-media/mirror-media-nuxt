<template>
  <div class="return">即將回到鏡週刊</div>
</template>

<script>
export default {
  layout: 'empty',
  middleware({ req, store, redirect }) {
    console.log(req.headers)

    let referer = ''
    if (process.server) {
      referer = req.headers.referer
    }

    if (referer !== 'https://core.newebpay.com/') {
      redirect('/subscribe')
    }
  },
  async mounted() {
    /*
     * get order info from sessionStoaage
     * use them to display order info in success page
     */

    const orderInfo = this.getDataFromSessionStorage('orderInfo')
    this.$store.dispatch('subscribe/updateOrderInfo', JSON.parse(orderInfo))

    /*
     * get infoPayload from sessionStorage
     * use them to get payment info from backend
     */

    const JwtToken = this.getDataFromSessionStorage('JwtToken')
    const MerchantOrderNo = this.getDataFromSessionStorage('MerchantOrderNo')
    this.$store.dispatch('subscribe/updateInfoPayload', {
      JwtToken,
      MerchantOrderNo,
    })

    const infoPayload = {
      merchant_order_no: MerchantOrderNo,
      jwt: JwtToken,
    }

    try {
      const info = await this.$axios.$post(
        `/api/v2/subscribe-magazine/info`,
        infoPayload
      )

      console.log(info)
      const { paymentStatus } = info.payment_status

      switch (paymentStatus) {
        case 'SUCCESS':
          this.$store.dispatch('subscribe/updateResultStatus', 'success')

          break

        default:
          this.$store.dispatch('subscribe/updateResultStatus', 'payment-fail')
          break
      }
    } catch (e) {
      this.$store.dispatch('subscribe/updateResultStatus', 'payment-fail')
    }
    console.log(document)
    this.$router.push('/subscribe/result')
  },
  methods: {
    getDataFromSessionStorage(name) {
      if (process.browser) {
        return sessionStorage.getItem(name)
      } else {
        return ''
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.return {
  cursor: pointer;
}
</style>
