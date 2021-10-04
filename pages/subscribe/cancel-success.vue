<template>
  <div class="cancel-success">
    <SubscribeWrapper>
      <h6 class="cancel-success__title">成功取消訂閱</h6>
      <div class="cancel-success__description">
        您已取消訂閱
        <!--        <span class="cancel-success__description_blue">-->
        <!--          鏡週刊 Premium 服務-年訂閱方案-->
        <!--        </span>-->
        。將在本次收費週期結束時生效。
      </div>
      <UiMembershipButtonPrimary
        class="ancel-success__back"
        @click.native="handleBack"
        >回訂閱紀錄</UiMembershipButtonPrimary
      >
    </SubscribeWrapper>
  </div>
</template>

<script>
import SubscribeWrapper from '~/components/SubscribeWrapper.vue'
import UiMembershipButtonPrimary from '~/components/UiMembershipButtonPrimary.vue'

export default {
  middleware: ['handle-go-to-marketing', 'handle-forbid-direct-navigate'],
  components: { SubscribeWrapper, UiMembershipButtonPrimary },
  methods: {
    handleBack() {
      window.location.assign('/profile/purchase')
    },
  },
}
</script>

<style lang="scss" scoped>
.cancel-success {
  min-height: calc(100vw - 150px);
  padding: 40px 20px 0 20px;
  @include media-breakpoint-up(sm) {
    min-height: calc(100vw - 850px);
    padding: 80px;
  }

  &__title {
    font-size: 20px;
    line-height: 32px;
    color: rgba(0, 0, 0, 0.87);
  }

  &__description {
    margin: 4px 0 24px 0;
    color: rgba(0, 0, 0, 0.66);

    &_blue {
      color: #054f77;
    }
  }

  &__back {
    margin: 0 auto;
    width: 240px;
    height: 48px;
  }
}
</style>
