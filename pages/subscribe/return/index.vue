<template>
  <div @click="clickHandler" class="return">即將回到鏡週刊</div>
</template>

<script>
export default {
  layout: 'empty',
  middleware({ req, store, redirect }) {
    let referer = ''
    if (process.server) {
      referer = req.headers.referer
    }
    console.log('=============')

    console.log(`referer is : ${referer}`)
    if (referer !== 'https://core.newebpay.com/') {
      console.log(`referer is not from newebpay`)
      // redirect('/subscribe')
    } else {
      console.log(`referer is from newebpay`)
    }

    // is come from newebpay
    // then turn on access of result page
    store.dispatch('subscribe/updateResultStatus', 'success')
  },
  methods: {
    clickHandler() {
      this.$router.push('/subscribe/result')
    },
    getDataFromSessionStorage(name) {
      if (process.browser) {
        return sessionStorage.getItem(name)
      } else {
        return ''
      }
    },
  },
  async mounted() {
    // determine where this page redirect from
    const referrer = document?.referrer
    console.log('referrer')
    console.log(referrer)

    // get order info from sessionStoaage
    // use them to display order info in success page
    const orderInfo = this.getDataFromSessionStorage('orderInfo')
    this.$store.dispatch('subscribe/updateOrderInfo', JSON.parse(orderInfo))

    // get infoPayload from sessionStorage
    // use them to get payment info from backend
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
    console.log('infoPayload')
    console.log(infoPayload)

    try {
      const info = await this.$axios.$post(
        `/api/v2/subscribe-magazine/info`,
        infoPayload
      )
      console.log('info')
      console.log(info)
    } catch (e) {
      console.log(e)
    }
  },
}
</script>

<style lang="scss" scoped>
.return {
  cursor: pointer;
}
</style>
