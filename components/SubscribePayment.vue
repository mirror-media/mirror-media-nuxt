<template>
  <div class="payment-page" v-html="paymentHtml"></div>
</template>

<script>
export default {
  props: {
    paymentHtml: {
      type: String,
      default: 'Loading',
    },
  },
}
</script>

<style lang="scss" scoped>
.payment-page {
  position: relative;
  width: 100%;
}
</style>
