<template>
  <div class="subscribe-magazine-page">
    <SubscribeStepProgress :currentStep="3" />
    <div class="order-success">
      <div class="order-success__wrapper">
        <p>您已完成付款，以下為本次訂購資訊，已同步寄送至您的信箱。</p>
        <SubscribeSuccessOrderInfo
          :orderInfo="orderInfo"
          :orderInfoPurchasedList="orderInfoPurchasedList"
        />
        <div class="back-to-subscribe-link-wrapper">
          <nuxt-link class="back-to-subscribe-link" to="/member-subscribe">
            回購買文章頁
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SubscribeStepProgress from '~/components/SubscribeStepProgress.vue'
import SubscribeSuccessOrderInfo from '~/components/SubscribeSuccessOrderInfo.vue'

export default {
  components: {
    SubscribeStepProgress,
    SubscribeSuccessOrderInfo,
  },
  computed: {
    orderInfo() {
      return {
        orderId: 'test order id',
      }
    },
    orderInfoPurchasedList() {
      return [
        {
          text: '鏡週刊 Premium 會員 (年訂閱)',
          hints: [
            '首月1元，第二個月起每年1,290元・信用卡自動扣繳。',
            '假的提示，如果有第二行的話',
          ],
          price: 1,
        },
        {
          text: '付款金額',
          price: 1,
        },
      ]
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
      //margin-bottom: 18px;
      @include media-breakpoint-up(sm) {
        //margin-bottom: 36px;
      }
    }
  }
}

.back-to-subscribe-link-wrapper {
  background-color: #f5f5f5;
  border-radius: 0 0 4px 4px;
  position: relative;
  top: -2px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 0;
  @include media-breakpoint-up(xl) {
    padding: 24px 0;
  }
}
.back-to-subscribe-link {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 240px;
  height: 48px;
  left: 336px;
  top: 349px;
  background: #1d9fb8;
  border-radius: 2px;
  font-size: 18px;
  line-height: 25px;
  color: #ffffff;
}
</style>
