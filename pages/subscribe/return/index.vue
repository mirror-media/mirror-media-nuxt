<template>
  <div @click="clickHandler" class="return">即將回到鏡週刊</div>
</template>

<script>
export default {
  layout: 'empty',
  middleware({ req, store }) {
    let referrer = ''
    if (process.server) {
      referrer = req.headers.referrer
    }
    console.log(referrer)
    // if (referrer !== 'https://core.newebpay.com/MPG/mpg_gateway') {
    //   redirect('/subscribe')
    // }

    // is come from newebpay
    store.dispatch('subscribe/updateResultStatus', 'success')
  },
  methods: {
    clickHandler() {
      this.$router.push('/subscribe/result')
    },
  },
  mounted() {
    // setTimeout(() => {
    //   this.$router.push('/subscribe/result')
    // }, 1000)
    const referrer = document.referrer
    console.log('referrer: ')
    console.log(referrer)
  },
}
</script>

<style lang="scss" scoped>
.return {
  cursor: pointer;
}
</style>
