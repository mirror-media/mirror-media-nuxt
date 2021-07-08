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
          <nuxt-link to="/member-subscribe" class="back-to-subscribe-link">
            <UiMembershipButtonPrimary>
              回購買文章頁
            </UiMembershipButtonPrimary>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SubscribeStepProgress from '~/components/SubscribeStepProgress.vue'
import SubscribeSuccessOrderInfo from '~/components/SubscribeSuccessOrderInfo.vue'
import UiMembershipButtonPrimary from '~/components/UiMembershipButtonPrimary.vue'

export default {
  components: {
    UiMembershipButtonPrimary,
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
  padding: 20px 8px;
  @include media-breakpoint-up(sm) {
    padding: 18px 8px;
  }
  &__wrapper {
    max-width: 990px;
    margin: auto;
    p {
      padding: 0 17px;
      margin-bottom: 13px;
      font-size: 16px;
      line-height: 150%;
      color: rgba(0, 0, 0, 0.87);
      @include media-breakpoint-up(sm) {
        padding: 0 25px;
        margin: 30px 24px 24px;
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
  @include media-breakpoint-up(md) {
    padding: 27px 0 24px 0;
  }
}

.back-to-subscribe-link {
  width: 240px;
}
</style>
