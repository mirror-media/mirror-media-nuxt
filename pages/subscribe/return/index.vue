<template>
  <div>即將回到鏡週刊</div>
</template>

<script>
export default {
  layout: 'empty',
  middleware({ req, store, redirect }) {
    let referer = ''
    if (process.server) {
      referer = req.headers
    }
    console.log('referer: ' + referer)
    if (referer !== 'https://core.newebpay.com/MPG/mpg_gateway') {
      redirect('/subscribe')
    }

    // is come from newebpay
    store.dispatch('subscribe/updateResultStatus', 'success')
  },

  mounted() {
    setTimeout(() => {
      this.$router.push('/subscribe/result')
    }, 1000)
  },
}
</script>

<style lang="scss" scoped></style>
