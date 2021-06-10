<template>
  <div class="order-success">
    <div class="order-success__wrapper">
      <p>您已完成付款，以下為本次訂購資訊，已同步寄送至您的信箱。</p>

      <SubscribeSuccessOrderInfo :orderInfo="orderInfo" :orderId="orderId" />

      <UiSubscribeInfo />
    </div>
  </div>
</template>

<script>
import UiSubscribeInfo from '~/components/UiSubscribeInfo.vue'
import SubscribeSuccessOrderInfo from '~/components/SubscribeSuccessOrderInfo.vue'
export default {
  components: {
    UiSubscribeInfo,
    SubscribeSuccessOrderInfo,
  },
  props: {
    orderInfo: {
      type: Object,
      isRequired: true,
      default: () => {
        return {}
      },
    },
    orderId: {
      type: String,
      isRequired: true,
      default: 'orderId',
    },
  },
}
</script>

<style lang="scss" scoped>
.order-success {
  position: relative;
  padding: 13px 8px;

  @include media-breakpoint-up(sm) {
    padding: 18px 8px;
  }

  &__wrapper {
    max-width: 990px;
    margin: auto;

    p {
      padding: 0 17px;
      margin-bottom: 13px;
      font-size: 15px;
      line-height: 1.87;
      text-align: justify;
      color: #4a4a4a;
      @include media-breakpoint-up(sm) {
        padding: 0 25px;
        margin-bottom: 18px;
      }
    }

    .order-info {
      margin-bottom: 18px;
      @include media-breakpoint-up(sm) {
        margin-bottom: 36px;
      }
    }
  }
}
</style>
