<template>
  <section class="page">
    <div v-if="loginPageState === 'form'" class="login-form-wrapper">
      <h1 class="title">登入</h1>
      <form class="page__form form" novalidate @submit.prevent>
        <UiMembershipEmailInput
          :shouldShowInvalidHint="shouldShowInvalidHint"
          @input="handleEmailInput"
          @inputValidStateChange="handleInputValidStateChange"
        />
        <label class="form__remember-me-checkbox remember-me-checkbox">
          <input v-model="shouldRememberMe" type="checkbox" />
          保持登入
        </label>
        <button class="form__login-button login-button" @click="handleSubmit">
          登入
        </button>
      </form>
    </div>
    <UiMembershipEmailSuccess
      v-else-if="loginPageState === 'success'"
      class="login-success-wrapper"
      :emailInput="emailInput"
    />
    <UiMembershipEmailError
      v-else-if="loginPageState === 'error'"
      class="login-error-wrapper"
      @backToForm="handleBackToForm"
    />
  </section>
</template>

<script>
import localforage from 'localforage'
import UiMembershipEmailInput from '~/components/UiMembershipEmailInput.vue'
import UiMembershipEmailSuccess from '~/components/UiMembershipEmailSuccess.vue'
import UiMembershipEmailError from '~/components/UiMembershipEmailError.vue'

/*
 * Firebase Authenticate with Firebase Using Email Link flow.
 * This component just implement the 1. part below in the flow and store the email for further email validation in 3. part.
 * For more info: https://firebase.google.com/docs/auth/web/email-link-auth
 *
 * 1. https://website/login            firebase.auth.sendSignInLinkToEmail("example@example.com")
 *                                                               +
 *                                                               |
 *                                                               |
 *                                                               v
 * 2. member's email service             click "https://website/finishSignIn" link in email
 *                                                               +
 *                                                               |
 *                                                               |
 *                                                               v
 * 3. https://website/finishSignIn    firebase.auth.isSignInWithEmailLink(window.location.href)
 *                                                 +                            +
 *                                              No |                            | Yes
 *                                                 |                            |
 *                                                 |       +-------------email validation------------+
 *                                                 v       |                    v                    |
 *                             back to "https://website/"  |   is email store in storage of device?  |
 *                                                         |           +                   +         |
 *                                                         |           |                   |         |
 *                                                         |        No |                   | Yes     |
 *                                                         |           |                   |         |
 *                                                         |           v                   |         |
 *                                                         |  provide your email           |         |
 *                                                         |           +                   |         |
 *                                                         |           |                   |         |
 *                                                         +-----------------------------------------+
 *                                                                     |                   v
 *                                                                     +-------->  sign in with email successfully
 *                                                                      with firebase.auth.signInWithEmailLink("example@example.com", window.location.href)
 */

export default {
  components: {
    UiMembershipEmailInput,
    UiMembershipEmailSuccess,
    UiMembershipEmailError,
  },
  data() {
    return {
      shouldShowInvalidHint: false,
      isEmailInputValid: false,
      emailInput: '',
      loginPageState: 'form',
      shouldRememberMe: false,
    }
  },
  async beforeMount() {
    await this.loadAuthService()
  },
  methods: {
    handleSubmit() {
      this.shouldShowInvalidHint = true
      if (this.isEmailInputValid) {
        this.sendSignInLinkToEmail()
      }
    },
    async loadAuthService() {
      try {
        await this.$fire.authReady()
      } catch (e) {
        console.error(e)
      }
    },
    createSignInLinkToEmail() {
      const origin = window.location.origin
      const path = '/finishSignUp'
      return this.shouldRememberMe
        ? `${origin}${path}?shouldRememberMe=true`
        : `${origin}${path}`
    },
    async sendSignInLinkToEmail() {
      const actionCodeSettings = {
        /*
         * URL you want to redirect back to. The domain (www.example.com) for this
         * URL must be in the authorized domains list in the Firebase Console.
         */
        url: this.createSignInLinkToEmail(),

        // This must be true.
        handleCodeInApp: true,

        /*
         * iOS: {
         *   bundleId: 'com.example.ios',
         * },
         * android: {
         *   packageName: 'com.example.android',
         *   installApp: true,
         *   minimumVersion: '12',
         * },
         * dynamicLinkDomain: 'example.page.link',
         */
      }
      try {
        await this.$fire.auth.sendSignInLinkToEmail(
          this.emailInput,
          actionCodeSettings
        )
        await localforage.setItem('emailForSignIn', this.emailInput)
        this.loginPageState = 'success'
      } catch (e) {
        console.error(e)
        this.loginPageState = 'error'
      }
    },
    handleInputValidStateChange(value) {
      this.isEmailInputValid = value
    },
    handleEmailInput(value) {
      this.emailInput = value
    },
    handleBackToForm() {
      this.loginPageState = 'form'
    },
  },
}
</script>

<style lang="scss" scoped>
.page {
  padding: 0 20px;
  min-height: calc(100vh - 118px);
  display: flex;
  align-items: center;
  &__form {
    margin: 20px 0 0 0;
  }
}

.login-form-wrapper {
  width: 100%;
  @include media-breakpoint-up(xl) {
    width: 300px;
    margin: 0 auto;
  }
}

.title {
  text-align: center;
  font-weight: 900;
  font-size: 18px;
  color: #054f77;
}

.form {
  &__remember-me-checkbox {
    margin: 10px 0 0 0;
  }
  &__login-button {
    margin: 20px 0 0 0;
  }
}
.remember-me-checkbox {
  font-size: 14px;
  display: flex;
  align-items: center;
  input {
    margin: 0 10px 0 0;
  }
}
.login-button {
  background-color: #054f77;
  width: 100%;
  text-align: center;
  font-weight: 900;
  color: white;
  height: 30px;
}

.after-form-submit-wrapper {
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h1 {
    font-size: 30px;
    color: #204f74;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  div {
    margin: 60px 0 0 0;
  }
  p {
    //margin: 60px 0 0 0;
    line-height: 2;
    font-size: 20px;
    display: flex;
    flex-direction: column;
    &.row {
      flex-direction: row;
    }
    justify-content: center;
    align-items: center;
    @include media-breakpoint-up(xl) {
      flex-direction: row;
    }
  }
  button,
  a {
    color: cornflowerblue;
  }
  button {
    text-decoration: underline;
  }
}
</style>
