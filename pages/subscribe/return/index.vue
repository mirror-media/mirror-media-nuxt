<template>
  <div @click="clickHandler" class="return">即將回到鏡週刊</div>
</template>

<script>
export default {
  layout: 'empty',
  middleware({ req, store, redirect }) {
    let referrer = ''
    if (process.server) {
      referrer = req.headers.referrer
    }
    console.log(referrer)
    // if (referrer !== 'https://core.newebpay.com/') {
    //   redirect('/subscribe')
    // }

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
    const referrer = document?.referrer
    console.log('referrer')
    console.log(referrer)
    const JwtToken = this.getDataFromSessionStorage('JwtToken')
    const MerchantOrderNo = this.getDataFromSessionStorage('MerchantOrderNo')
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
