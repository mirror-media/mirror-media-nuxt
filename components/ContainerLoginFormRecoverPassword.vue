<template>
  <div class="form-recover-password">
    <h1 class="title">升級帳號安全性</h1>
    <p class="form-recover-password__description description">
      為了提升帳號安全，從 4 月 28
      日起，所有鏡週刊會員都需要以密碼登入。請您前往設定密碼，以繼續享受鏡週刊會員服務。
    </p>
    <UiMembershipButtonPrimary
      class="form-recover-password__go-to-recover-password"
      @click.native="handleGoToRecoverPassword"
    >
      <p>前往設定密碼</p>
    </UiMembershipButtonPrimary>
    <UiMembershipLink class="form-recover-password__back" href="">
      回上一步
    </UiMembershipLink>
  </div>
</template>

<script>
import UiMembershipButtonPrimary from './UiMembershipButtonPrimary.vue'
import UiMembershipLink from './UiMembershipLink.vue'

export default {
  components: {
    UiMembershipButtonPrimary,
    UiMembershipLink,
  },
  props: {
    email: {
      type: String,
      default: '',
    },
  },
  methods: {
    handleGoToRecoverPassword() {
      window.location.assign(`/recoverPassword?email=${this.email}`)
    },
  },
}
</script>

<style lang="scss" scoped>
.form-recover-password {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.08), 0px 4px 28px rgba(0, 0, 0, 0.06);
  padding: 32px 48px 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @include media-breakpoint-up(md) {
    max-width: 423px;
    margin: 0 auto;
  }

  &__description {
    margin: 16px 0 0 0;
  }
  &__go-to-recover-password {
    margin: 32px 0 0 0;
  }
  &__back {
    margin: 24px 0 0 0;
  }
}

.title {
  font-size: 20px;
  line-height: 32px;
  color: #4a4a4a;
}

.description {
  font-size: 16px;
  line-height: 150%;
  color: rgba(0, 0, 0, 0.66);
}
</style>
