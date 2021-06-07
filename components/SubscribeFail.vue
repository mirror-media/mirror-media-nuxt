<template>
  <div class="order-fail">
    <div class="order-fail__wrapper">
      {{ orderStatus }}
      <!-- <p>您已完成付款，以下為本次訂購資訊，已同步寄送至您的信箱。</p> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    orderStatus: {
      type: String,
      isRequired: true,
      default: 'order-fail',
    },
    orderId: {
      type: String,
      isRequired: true,
      default: 'orderId',
    },
  },
  components: {},
}
</script>

<style lang="scss" scoped>
.order-fail {
  position: relative;
  padding: 13px 25px;

  &__wrapper {
    max-width: 990px;
    margin: auto;
  }
}
</style>
