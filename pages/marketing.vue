<template>
  <div class="marketing">
    <SubscribeWrapper>
      <h6 class="marketing__title">此頁面為會員訂閱頁面</h6>
      <div class="marketing__description">
        <p>
          由於您為鏡週刊的 VIP，VIP
          期間不須付款即享會員專區文章暢讀。若您有意願付費支持，請於 VIP
          期間後再付款
        </p>
      </div>
      <UiMembershipButtonPrimary
        class="marketing__back"
        @click.native="handleBack"
        >回會員專區</UiMembershipButtonPrimary
      >
    </SubscribeWrapper>
  </div>
</template>

<script>
import SubscribeWrapper from '~/components/SubscribeWrapper.vue'
import UiMembershipButtonPrimary from '~/components/UiMembershipButtonPrimary.vue'

export default {
  components: { SubscribeWrapper, UiMembershipButtonPrimary },
  methods: {
    handleBack() {
      window.location.assign('/section/member')
    },
  },
}
</script>

<style lang="scss" scoped>
.marketing {
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
    font-size: 18px;
    line-height: 150%;
    color: rgba(0, 0, 0, 0.66);
  }

  &__back {
    margin: 0 auto;
    width: 240px;
    height: 48px;
  }
}
</style>
