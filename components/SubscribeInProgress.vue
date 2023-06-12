<template>
  <div class="in-progress">
    <div class="in-progress-wrapper">
      <h1 class="in-progress-wrapper__title">
        訂單處理中，請至訂閱紀錄頁確認交易結果。
      </h1>
      <div class="in-progress-wrapper__content">
        <SubscribeSuccessOrderInfoContentRow
          :data="orderInfo.orderId"
          title="訂單編號"
        />

        <a :href="purchaseHistoryLink" class="in-progress-wrapper__button">
          <UiMembershipButtonPrimary>回訂閱紀錄頁</UiMembershipButtonPrimary>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import SubscribeSuccessOrderInfoContentRow from '~/components/SubscribeSuccessOrderInfoContentRow.vue'
import UiMembershipButtonPrimary from '~/components/UiMembershipButtonPrimary.vue'

export default {
  components: {
    SubscribeSuccessOrderInfoContentRow,
    UiMembershipButtonPrimary,
  },
  props: {
    orderInfo: {
      type: Object,
      default: () => ({
        orderId: '',
      }),
    },
  },
  inject: {
    purchaseHistoryLink: {
      default: '/profile/purchase',
    },
  },
}
</script>

<style lang="scss" scoped>
.in-progress {
  font-size: 16px;
  line-height: 150%;
  color: rgba(0, 0, 0, 0.87);
  align-items: center;
  height: 50vh;
  max-width: 990px;
  margin: 0 auto;

  @include media-breakpoint-up(xl) {
    font-size: 18px;
  }
}
.in-progress-wrapper {
  display: flex;
  flex-direction: column;
  margin: 20px 0 0 0;
  @include media-breakpoint-up(sm) {
    margin: 47px;
  }
  &__title {
    color: #000000de;
    margin: 0 auto 20px;
    @include media-breakpoint-up(sm) {
      margin: 0 auto 32px;
    }
  }
  &__content {
    display: flex;
    flex-direction: column;
    border-radius: 4px;
    background-color: #f5f5f5;
    padding: 27px 24px 24px 25px;
    @include media-breakpoint-up(sm) {
      padding: 17px 25px 30px 25px;
    }
    @include media-breakpoint-up(xl) {
      padding: 24px;
    }
  }
  &__button {
    width: 240px;
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 0px;
    margin-top: 24px;

    @include media-breakpoint-up(sm) {
      margin-top: 48px;
    }
  }

  ::v-deep .content_row__title {
    min-width: 100px;
    @include media-breakpoint-up(sm) {
      min-width: 180px;
    }
  }
}
</style>
