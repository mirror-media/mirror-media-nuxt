<template>
  <section class="recover-password">
    <div class="wrapper">
      <h1 class="wrapper__title">如果您要更改密碼</h1>
      <p class="wrapper__description">
        請輸入您登入時使用的 Email 信箱。我們會發送一封 Email
        到這個地址，裡面附有重新設定密碼的連結。
      </p>
      <UiMembershipInputEmailInvalidation
        class="wrapper__email-input"
        :emailProps="email"
        :shouldShowInvalidHint="isSubmitButtonClicked"
        @input="handleInput"
        @inputValidStateChange="handleInputValidStateChange"
      />
      <div class="wrapper__submit-button-wrapper">
        <UiRecoverPasswordHints class="wrapper__hints" :state="hintState" />
        <UiMembershipButtonPrimary
          class="wrapper__submit-button"
          :disabled="!email || shouldAvoidEmailSpam"
          @click.native="handleSubmit"
        >
          <p v-if="shouldAvoidEmailSpam">
            重新寄送...({{ emailSpamSecondCounter }} 秒)
          </p>
          <UiMembershipLoadingIcon v-else-if="isLoading" />
          <p v-else>送出</p>
        </UiMembershipButtonPrimary>
      </div>
      <button
        v-if="hintState === 'emailNotExist'"
        class="wrapper__register-button register-button text-button"
        @click="handleRegisterButtonClick"
      >
        註冊會員
      </button>
      <button
        v-else
        class="wrapper__back-button back-button text-button"
        @click="handleBackButtonClick"
      >
        回上一頁
      </button>
    </div>
  </section>
</template>

<script>
import UiMembershipInputEmailInvalidation from '~/components/UiMembershipInputEmailInvalidation.vue'
import UiRecoverPasswordHints from '~/components/UiRecoverPasswordHints.vue'
import UiMembershipButtonPrimary from '~/components/UiMembershipButtonPrimary.vue'
import UiMembershipLoadingIcon from '~/components/UiMembershipLoadingIcon.vue'
import actionCodeSettingsAppConfig from '~/constants/firebase-action-code-settings-app-config'

export default {
  components: {
    UiMembershipInputEmailInvalidation,
    UiRecoverPasswordHints,
    UiMembershipButtonPrimary,
    UiMembershipLoadingIcon,
  },
  data() {
    return {
      isEmailInputValid: false,
      email: this.$route?.query?.email ?? '',
      isLoading: false,
      isError: false,
      isSending: false,
      isSubmitButtonClicked: false,
      isEmailSignInWithEmailMethod: undefined,
      shouldAvoidEmailSpam: false,
      emailSpamSecondCounter: 30,
    }
  },
  computed: {
    hintState() {
      if (this.isSending) {
        return 'sending'
      } else if (this.isEmailSignInWithEmailMethod === false) {
        return 'emailNotExist'
      } else if (this.isError) {
        return 'error'
      }

      if (this.isEmailSignInWithEmailMethod) {
        return 'success'
      }
      return ''
    },
  },
  methods: {
    handleInput(value) {
      this.email = value
    },

    handleInputValidStateChange(value) {
      this.isEmailInputValid = value
    },

    createActionCodeSettings() {
      return {
        /*
         * URL you want to redirect back to. The domain (www.example.com) for this
         * URL must be in the authorized domains list in the Firebase Console.
         */
        url: createUrl(),

        // This must be true.
        handleCodeInApp: true,

        ...actionCodeSettingsAppConfig,
      }

      function createUrl() {
        const origin = window.location.origin
        const path = '/login'
        return `${origin}${path}`
      }
    },
    async checkFirebaseUserExistWithEmailSignInMethods(email = '') {
      try {
        const responseArray = await this.$fire.auth.fetchSignInMethodsForEmail(
          email
        )
        return (responseArray ?? []).reduce(function checkSignInMethodsHasEmail(
          acc,
          curr
        ) {
          return (
            acc || (curr ?? '') === 'emailLink' || (curr ?? '') === 'password'
          )
        },
        false)
      } catch (e) {
        throw new Error(e)
      }
    },

    // TODO: refactor with xstate is better, so many boolean flags
    async handleSubmit() {
      this.isSubmitButtonClicked = true
      if (
        !this.isEmailInputValid ||
        this.shouldAvoidEmailSpam ||
        this.isLoading
      ) {
        return
      }

      this.isLoading = true
      try {
        const isEmailSignInWithEmailMethods =
          await this.checkFirebaseUserExistWithEmailSignInMethods(this.email)

        this.isLoading = false
        this.isEmailSignInWithEmailMethod = isEmailSignInWithEmailMethods
        if (!this.isEmailSignInWithEmailMethod) {
          return
        }
      } catch (e) {
        this.isLoading = false
        this.isError = true
        console.error(e)
      }

      this.isSending = true
      this.isLoading = true
      try {
        // localize the password reset email by updating the language code on the Auth instance before sending the email
        this.$fire.auth.languageCode = 'zh_tw'
        await this.$fire.auth.sendPasswordResetEmail(
          this.email,
          this.createActionCodeSettings()
        )

        this.shouldAvoidEmailSpam = true
        const emailSpamCounter = setInterval(() => {
          this.emailSpamSecondCounter -= 1
          if (this.emailSpamSecondCounter <= -1) {
            this.shouldAvoidEmailSpam = false
            this.emailSpamSecondCounter = 30
            clearInterval(emailSpamCounter)
          }
        }, 1000)
        this.isSending = false
        this.isLoading = false
      } catch (e) {
        this.isSending = false
        this.isLoading = false
        this.isError = true
        console.error(e)
      }
    },
    handleBackButtonClick() {
      this.$router.back()
    },
    handleRegisterButtonClick() {
      window.location.assign('/login')
    },
  },
}
</script>

<style lang="scss" scoped>
.recover-password {
  padding: 24px 8px;
  background-color: #f2f2f2;

  @include media-breakpoint-up(md) {
    padding: 48px 0;
  }
}

.wrapper {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.08), 0px 4px 28px rgba(0, 0, 0, 0.06);
  padding: 24px 20px 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @include media-breakpoint-up(md) {
    max-width: 423px;
    margin: 0 auto;
    padding: 32px 48px 24px;
  }

  &__title {
    font-size: 20px;
    line-height: 32px;
    color: #4a4a4a;
  }
  &__description {
    margin: 16px 0 0 0;
    font-size: 16px;
    line-height: 150%;
    color: rgba(0, 0, 0, 0.66);
  }
  &__email-input {
    margin: 32px 0 0 0;
  }
  &__submit-button-wrapper {
    width: 100%;
    text-align: center;
    margin: 24px 0 0 0;
  }
  &__back-button,
  &__register-button {
    margin: 24px 0 0 0;
  }
}

.text-button {
  font-size: 15px;
  line-height: 21px;
  text-align: center;
  color: #1d9fb8;
  border-bottom: 1px solid transparent;
  &:hover {
    border-bottom: 1px solid #1d9fb8;
  }
}
</style>
