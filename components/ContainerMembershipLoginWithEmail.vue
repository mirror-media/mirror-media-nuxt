<template>
  <section class="page">
    <div v-if="loginPageState === 'form'" class="login-form-wrapper">
      <h1 class="title">登入</h1>
      <form class="page__form form" @submit.prevent>
        <UIMembershipEmailInput
          :showInvalidHint="showInvalidHint"
          @input="handleEmailInput"
          @inputValidStateChange="handleInputValidStateChange"
        />
        <button class="form__login-button login-button" @click="handleSubmit">
          登入
        </button>
      </form>
    </div>
    <div
      v-else-if="loginPageState === 'success'"
      class="after-form-submit-wrapper login-success-wrapper"
    >
      <h1>
        <span>請到信箱收取驗證信件，</span>
        <span>即可進行會員登入！</span>
      </h1>
      <div>
        <p>
          <span>登入鏡週刊的連結已寄送至 &nbsp;</span>
          <span v-text="emailInput"></span>
        </p>
        <p>
          <span>請收信並點擊信件中連結，</span>
          <span>即可登入鏡週刊。</span>
        </p>
      </div>
    </div>
    <div
      v-else-if="loginPageState === 'error'"
      class="after-form-submit-wrapper login-error-wrapper"
    >
      <h1>登入失敗</h1>
      <div>
        <p class="row">
          <span>請點選</span>
          <button class="back-to-form-button" @click="handleBackToForm">
            此連結
          </button>
          <span>重新登入，</span>
        </p>
        <p>
          <span>或是聯繫客服 &nbsp;</span>
          <span>
            <a
              href="mailto:service@mirrormedia.mg"
              target="_blank"
              rel="noopener noreferrer"
            >
              service@mirrormedia.mg
            </a>
            &nbsp; / &nbsp;
          </span>
          <span>02-6633-3805 &nbsp;</span>
          <span>我們將有專人為你服務。</span>
        </p>
      </div>
    </div>
  </section>
</template>

<script>
import UIMembershipEmailInput from '~/components/UIMembershipEmailInput.vue'

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

const actionCodeSettings = {
  /*
   * URL you want to redirect back to. The domain (www.example.com) for this
   * URL must be in the authorized domains list in the Firebase Console.
   */
  url: 'http://localhost:3000/finishSignUp?cartId=1234',

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
export default {
  components: {
    UIMembershipEmailInput,
  },
  data() {
    return {
      showInvalidHint: false,
      isEmailInputValid: false,
      emailInput: '',
      loginPageState: 'form',
    }
  },
  async created() {
    await this.loadAuthService()
  },
  methods: {
    handleSubmit() {
      this.showInvalidHint = true
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
    async sendSignInLinkToEmail() {
      try {
        await this.$fire.auth.sendSignInLinkToEmail(
          this.emailInput,
          actionCodeSettings
        )
        window.localStorage.setItem('emailForSignIn', this.emailInput)
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
  &__login-button {
    margin: 20px 0 0 0;
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
