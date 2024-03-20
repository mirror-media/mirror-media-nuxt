<template>
  <div class="login-form">
    <div class="login-form__federated-login federated-login">
      <ContainerMembershipLoginWithFacebookNew
        :isFederatedRedirectResultLoading="isFederatedRedirectResultLoading"
        class="federated-login__facebook"
      />
      <ContainerMembershipLoginWithGoogleNew
        :isFederatedRedirectResultLoading="isFederatedRedirectResultLoading"
        class="federated-login__google"
      />
      <ContainerMembershipLoginWithAppleNew
        :isFederatedRedirectResultLoading="isFederatedRedirectResultLoading"
        class="federated-login__apple"
      />
    </div>
    <div v-if="showHint" class="login-form__hint">
      {{ hint }}
    </div>
    <div class="login-form__separator separator">
      <span>或</span>
    </div>
    <div class="login-form__email-login email-login">
      <!-- 當使用點擊下一步又回到上一步後，原本輸入的值會被清空。
      3.0希望保留email，不要被清空 -->
      <UiMembershipInputEmailInvalidation
        class="email-login__email-input"
        :shouldShowInvalidHint="isSubmitButtonClicked"
        @input="handleInput"
        @inputValidStateChange="handleInputValidStateChange"
      />
      <div class="email-login__submit-button-wrapper">
        <UiMembershipButtonPrimary
          :disabled="!isEmailInputValid"
          @click.native="handleSubmit"
        >
          <UiMembershipLoadingIcon v-if="isLoading" />
          <p v-else>下一步</p>
        </UiMembershipButtonPrimary>
      </div>
    </div>
    <UiMembershipRightsCaveat class="login-form__rights-caveat" />
  </div>
</template>

<script>
import ContainerMembershipLoginWithFacebookNew from './ContainerMembershipLoginWithFacebookNew.vue'
import ContainerMembershipLoginWithGoogleNew from './ContainerMembershipLoginWithGoogleNew.vue'
import ContainerMembershipLoginWithAppleNew from './ContainerMembershipLoginWithAppleNew.vue'
import UiMembershipLoadingIcon from './UiMembershipLoadingIcon.vue'
import UiMembershipInputEmailInvalidation from './UiMembershipInputEmailInvalidation.vue'
import UiMembershipButtonPrimary from './UiMembershipButtonPrimary.vue'
import UiMembershipRightsCaveat from './UiMembershipRightsCaveat.vue'

export default {
  components: {
    ContainerMembershipLoginWithFacebookNew,
    ContainerMembershipLoginWithGoogleNew,
    ContainerMembershipLoginWithAppleNew,
    UiMembershipLoadingIcon,
    UiMembershipInputEmailInvalidation,
    UiMembershipButtonPrimary,
    UiMembershipRightsCaveat,
  },
  props: {
    isFederatedRedirectResultLoading: {
      type: Boolean,
      default: true,
    },
    email: {
      type: String,
      default: '',
    },
    showHint: {
      type: Boolean,
      default: false,
    },
    prevAuthMethod: {
      type: String,
      default: 'Google',
    },
  },
  data() {
    return {
      /**
       * 使用者輸入的email資訊是否合乎email格式
       */
      isEmailInputValid: false,

      /**
       * UI related state.
       * 會影響子元件 `UiMembershipInputEmailInvalidation` 是否會顯示hint。
       * 詳細邏輯請見子元件。
       */
      isSubmitButtonClicked: false,

      /**
       * UI related state.
       * 當執行函式 handleSubmit 中 `this.$fire.auth.fetchSignInMethodsForEmail`時，會改為true，避免多次觸發造成race condition。
       */
      isLoading: false,
    }
  },
  computed: {
    hint() {
      let hint = ''
      switch (this.prevAuthMethod) {
        case 'Google':
        case 'Facebook':
        case 'Apple':
          hint = `由於您曾以 ${this.prevAuthMethod} 帳號登入，請點擊上方「使用${this.prevAuthMethod}帳號繼續」重試。`
          break

        case 'email':
          hint = `由於您曾以email帳號密碼登入，請輸入下方email重試。`
      }

      return hint
    },
  },

  methods: {
    /**
     * 在輸入帳號密碼並點擊按鈕後執行。
     * 會依序做三件事情：
     * 1. 將狀態 `this.isSubmitButtonClicked` 與 `this.isLoading` 的值改為true。
     * 2. 執行非同步函式 `this.$fire.auth.fetchSignInMethodsForEmail(this.email)`，該函式會取得特定email的登入方式，
     * 並依據登入方式，emit 事件 `verifyEmailSignInMethod`。 emit 後會於父元件 `ContainerLoginForm.vue` 與 `login.vue`修改狀態 `this.prevAuthMethod`
     * 3.再將狀態 `this.isLoading` 改為 false
     */
    async handleSubmit() {
      this.isSubmitButtonClicked = true

      this.isLoading = true
      try {
        /*
         * (handle email/password auth)
         * determine which method( 3rd party auth like facebook/google, or password)
         * is been used by this email before.
         */
        const responseArray = await this.$fire.auth.fetchSignInMethodsForEmail(
          this.email
        )

        /*
         * Hint, If email verify is active in the future,
         * responseArray would have multi value
         */
        const isEmailExistWithEmailLinkSignInMethod =
          responseArray &&
          responseArray.find((signInMethod) => signInMethod === 'emailLink')

        const isEmailExistWithEmailPasswordSignInMethod =
          responseArray &&
          responseArray.find((signInMethod) => signInMethod === 'password')

        const isEmailHasBeenUsedByGoogleAuth =
          responseArray &&
          responseArray.find((signInMethod) => signInMethod === 'google.com')

        const isEmailHasBeenUsedByFacebookAuth =
          responseArray &&
          responseArray.find((signInMethod) => signInMethod === 'facebook.com')

        const isEmailHasBeenUsedByAppleAuth =
          responseArray &&
          responseArray.find((signInMethod) => signInMethod === 'apple.com')

        if (isEmailExistWithEmailLinkSignInMethod) {
          this.$emit('verifyEmailSignInMethod', 'emailLink')
        } else if (isEmailExistWithEmailPasswordSignInMethod) {
          this.$emit('verifyEmailSignInMethod', 'password')
        } else if (isEmailHasBeenUsedByGoogleAuth) {
          this.$emit('verifyEmailSignInMethod', 'google.com')
        } else if (isEmailHasBeenUsedByFacebookAuth) {
          this.$emit('verifyEmailSignInMethod', 'facebook.com')
        } else if (isEmailHasBeenUsedByAppleAuth) {
          this.$emit('verifyEmailSignInMethod', 'apple.com')
        } else {
          this.$emit('goToRegister')
        }
      } catch (e) {
        console.error(e)
      }
      this.isLoading = false
    },
    handleInput(value) {
      // 更新父元件的data this.email
      this.$emit('update:email', value)
    },
    handleInputValidStateChange(value) {
      this.isEmailInputValid = value
    },
  },
}
</script>

<style lang="scss" scoped>
.login-form {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.08), 0px 4px 28px rgba(0, 0, 0, 0.06);
  padding: 24px 20px 16px;
  @include media-breakpoint-up(md) {
    max-width: 423px;
    margin: 0 auto;
    padding: 32px 48px 24px;
  }

  &__hint {
    font-size: 16px;
    line-height: 150%;
    text-align: center;
    color: #e51731;
    margin: 12px 0 24px 0;
  }
  &__separator {
    margin: 16px 0 0 0;
  }
  &__email-login {
    margin: 16px 0 0 0;
  }
  &__rights-caveat {
    margin: 24px 0 0 0;
  }
}

.federated-login {
  &__google,
  &__apple {
    margin: 12px 0 0 0;
  }
}

.separator {
  font-size: 13px;
  line-height: 19px;
  color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  span {
    margin: 0 12px;
  }
  &:before,
  &:after {
    content: '';
    display: inline-block;
    flex: 1 1 auto;
    height: 1px;
    background-color: rgba(0, 0, 0, 0.1);
  }
}

.email-login {
  &__submit-button-wrapper {
    margin: 24px 0 0 0;
  }
}
</style>
