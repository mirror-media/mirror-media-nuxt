<template>
  <div class="fail">
    <div class="payment-fail" v-if="orderStatus === 'payment-fail'">
      <div class="error-message">
        信用卡付款失敗，請再次確認信用卡資訊，或更換信用卡完成訂購手續，謝謝！
      </div>
      <div class="payment-fail__wrapper">
        <div class="error-info__wrapper">
          <div class="error-info__row">
            <div class="row__title">訂單編號</div>
            <div class="row__content">{{ orderId }}</div>
          </div>
          <div class="error-info__row">
            <div class="row__title">付款錯誤訊息</div>
            <div class="row__content">WYZxxxxx 拒絕交易</div>
          </div>
        </div>
        <div class="button__wrapper">
          <UiSubscribeButton title="回前頁" class="previous-btn" />
        </div>
      </div>
    </div>
    <div class="order-fail" v-else>
      <div class="order-fail__wrapper">
        {{ errorMessage }}
        <div class="button__wrapper">
          <UiSubscribeButton title="回前頁" class="previous-btn" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UiSubscribeButton from '~/components/UiSubscribeButton.vue'
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
  components: {
    UiSubscribeButton,
  },
  computed: {
    errorMessage() {
      return '訂單建立失敗，請再次下訂單，或聯繫客服專員（02-6633-3805 / readr@readr.tw）協助。'
    },
  },
}
</script>

<style lang="scss" scoped>
.order-fail,
.payment-fail {
  display: flex;
  font-family: PingFangTC;
  font-size: 15px;
  line-height: 1.87;
  text-align: justify;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &__wrapper {
    margin: auto;
    border-radius: 4px;
    background-color: #f5f5f5;
    color: #4a4a4a;

    @include media-breakpoint-up(sm) {
      padding: 17px 25px 30px 25px;
      max-height: 50vh;
      width: 990px;
    }
  }
}

.order-fail_wrapper {
  padding: 27px 24px 24px 24px;

  @include media-breakpoint-up(sm) {
    padding: 17px 25px 30px 25px;
    margin: 47px 25px;
  }
}

.payment-fail__wrapper {
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  font-size: 15px;
  line-height: 21px;

  @include media-breakpoint-up(sm) {
    font-size: 18px;
    line-height: 25px;
    margin: 20px 24px;
  }

  & .button__wrapper {
    width: 240px;
    height: 48px;
    align-self: center;
    margin: 28px 0 4px 0;
  }
}

.button__wrapper {
  margin-top: 48px;
  justify-content: center;
  display: flex;

  @include media-breakpoint-up(sm) {
    margin-top: 17px;
    justify-content: flex-start;
  }
}

.error-message {
  font-size: 15px;
  line-height: 200%;
  color: #4a4a4a;
  margin: 20px;

  @include media-breakpoint-up(sm) {
    width: 990px;
    margin: 24px;
    padding-left: 24px;
    font-size: 18px;
    line-height: 25px;
  }
}

.error-info__row {
  display: flex;

  & + & {
    margin-top: 20px;
  }
}

.row__title {
  width: 200px;
}
</style>
