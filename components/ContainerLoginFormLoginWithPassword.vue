<template>
  <div class="login-form-login-with-password">
    <h1 class="title">輸入密碼</h1>
    <div class="login-form-login-with-password__inputs inputs">
      <UiMembershipInputPasswordErrorHint
        class="inputs__password"
        :shouldShowErrorHint="shouldShowErrorHint"
        @input="handleInputPassword"
        @inputValidStateChange="handleInputValidStateChangePassword"
      />
    </div>
    <div class="login-form-login-with-password__buttons buttons">
      <UiMembershipButtonPrimary
        :disabled="!isPasswordValid"
        @click.native="handleSubmit"
      >
        <UiMembershipLoadingIcon v-if="isLoading" />
        <p v-else>登入會員</p>
      </UiMembershipButtonPrimary>
      <UiMembershipButtonSecondary
        class="buttons__go-back"
        @click.native="handleGoBack"
      >
        <p>回上一步</p>
      </UiMembershipButtonSecondary>
    </div>
    <div class="login-form-login-with-password__links links">
      <UiMembershipLink href="/recoverPassword">忘記密碼？</UiMembershipLink>
      <UiMembershipLink
        class="links__member-without-password"
        href="/recoverPassword"
      >
        已經是會員了，但我沒有密碼
      </UiMembershipLink>
    </div>
  </div>
</template>

<script>
import UiMembershipInputPasswordErrorHint from './UiMembershipInputPasswordErrorHint.vue'
import UiMembershipButtonPrimary from './UiMembershipButtonPrimary.vue'
import UiMembershipButtonSecondary from './UiMembershipButtonSecondary.vue'
import UiMembershipLoadingIcon from './UiMembershipLoadingIcon.vue'
import UiMembershipLink from './UiMembershipLink.vue'

export default {
  components: {
    UiMembershipInputPasswordErrorHint,
    UiMembershipButtonPrimary,
    UiMembershipButtonSecondary,
    UiMembershipLoadingIcon,
    UiMembershipLink,
  },
  props: {
    email: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      password: '',
      isPasswordValid: false,
      isLoading: false,
      shouldShowErrorHint: false,
    }
  },
  methods: {
    handleInputPassword(value) {
      this.password = value
    },
    handleInputValidStateChangePassword(value) {
      this.isPasswordValid = value
    },

    async handleSubmit() {
      this.isLoading = true
      try {
        const { user = {} } = await this.$fire.auth.signInWithEmailAndPassword(
          this.email,
          this.password
        )
        this.isLoading = false
        this.$emit('loginSuccess', user)
      } catch (e) {
        this.isLoading = false
        if (e.code === 'auth/wrong-password') {
          this.shouldShowErrorHint = true
        }
        this.$emit('loginFail', e)
        console.error(e)
      }
    },

    handleGoBack() {
      this.$emit('back')
    },
  },
}
</script>

<style lang="scss" scoped>
.login-form-login-with-password {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.08), 0px 4px 28px rgba(0, 0, 0, 0.06);
  padding: 24px 20px 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @include media-breakpoint-up(md) {
    width: 423px;
    margin: 0 auto;
    padding: 32px 48px 24px;
  }

  &__inputs {
    margin: 16px 0 0 0;
  }
  &__buttons {
    margin: 24px 0 0 0;
  }
  &__links {
    margin: 24px 0 0 0;
  }
}

.title {
  font-size: 20px;
  line-height: 32px;
  color: #4a4a4a;
}

.inputs {
  width: 100%;
}

.buttons {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  &__go-back {
    font-size: 18px !important;
    margin: 16px 0 0 0;
  }
}

.links {
  display: flex;
  flex-direction: column;
  align-items: center;
  &__member-without-password {
    margin: 12px 0 0 0;
  }
}
</style>
