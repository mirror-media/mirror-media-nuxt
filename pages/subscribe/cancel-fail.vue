<template>
  <div class="cancel-fail">
    <SubscribeWrapper>
      <h6 class="cancel-fail__title">取消訂閱失敗</h6>
      <div class="cancel-fail__description">
        <p>請重新操作或聯繫客服由專人為您服務。</p>
        <p>MM-onlineservice@mirrormedia.mg</p>
        <p>02-6633-3966</p>
      </div>
      <UiMembershipButtonPrimary
        class="cancel-fail__back"
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
  middleware: ['handle-go-to-marketing'],
  components: { SubscribeWrapper, UiMembershipButtonPrimary },
  methods: {
    handleBack() {
      window.location.assign('/subscribe/set')
    },
  },
}
</script>

<style lang="scss" scoped>
.cancel-fail {
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
  }

  &__back {
    margin: 0 auto;
    width: 240px;
    height: 48px;
  }
}
</style>
