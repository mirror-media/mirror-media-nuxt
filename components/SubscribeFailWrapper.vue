<template>
  <div class="fail-wrapper">
    <h1 class="fail-wrapper__title">逾時未完成結帳，付款失敗，請重新操作。</h1>
    <div class="fail-wrapper__content">
      <p class="fail-wrapper__message">
        {{ failMessage }}
      </p>

      <a :href="subscribeFailButtonLink" class="fail-wrapper__button">
        <UiMembershipButtonPrimary>回前頁</UiMembershipButtonPrimary>
      </a>
    </div>
  </div>
</template>

<script>
import UiMembershipButtonPrimary from '~/components/UiMembershipButtonPrimary.vue'

export default {
  components: {
    UiMembershipButtonPrimary,
  },
  props: {
    resultStatus: {
      type: String,
      isRequired: true,
      default: 'order-fail',
    },
  },
  computed: {
    failMessage() {
      return this.resultStatus === 'order-fail'
        ? '訂單建立失敗，請再次下訂單。'
        : '信用卡付款失敗，請再次確認信用卡資訊，或更換信用卡完成訂購手續，謝謝！'
    },
  },
  inject: {
    subscribeFailButtonLink: {
      default: '/',
    },
  },
}
</script>

<style lang="scss" scoped>
.fail-wrapper {
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
  &__message {
    color: #054f77;
    margin: 0 auto 27px;
    @include media-breakpoint-up(sm) {
      margin: 0 auto 17px;
    }
  }
  &__button {
    width: 240px;
    display: block;
    margin: 0 auto;
  }
}
</style>
