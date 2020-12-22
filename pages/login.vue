<template>
  <section class="page">
    <div v-if="pageState === 'form'" class="form-wrapper">
      <h1 class="form-wrapper__title title">登入</h1>
      <div class="form-wrapper__federated-login federated-login">
        <div class="facebook-login-wrapper">
          <div
            v-show="isFederatedRedirectResultLoading"
            class="federated-login-loading-wrapper"
          >
            <UiMembershipSpinner />
          </div>
          <ContainerMembershipLoginWithFacebook
            v-show="!isFederatedRedirectResultLoading"
          />
        </div>
        <div class="federated-login__login-wrapper google-login-wrapper">
          <div
            v-show="isFederatedRedirectResultLoading"
            class="federated-login-loading-wrapper"
          >
            <UiMembershipSpinner />
          </div>
          <ContainerMembershipLoginWithGoogle
            v-show="!isFederatedRedirectResultLoading"
          />
        </div>
      </div>
      <div class="form-wrapper__separator separator">
        <p>或</p>
      </div>
      <ContainerMembershipLoginWithEmail
        @success="handleEmailLoginSuccess"
        @error="handleLoginError"
      />
    </div>
    <UiMembershipEmailSuccess
      v-else-if="pageState === 'success'"
      class="success-wrapper"
      :emailInput="emailShowInSuccess"
    />
    <UiMembershipError
      v-else-if="pageState === 'error'"
      class="error-wrapper"
      @backToForm="handleBackToForm"
    />
  </section>
</template>

<script>
import localforage from 'localforage'
import ContainerMembershipLoginWithGoogle from '~/components/ContainerMembershipLoginWithGoogle.vue'
import ContainerMembershipLoginWithFacebook from '~/components/ContainerMembershipLoginWithFacebook.vue'
import ContainerMembershipLoginWithEmail from '~/components/ContainerMembershipLoginWithEmail.vue'
import UiMembershipEmailSuccess from '~/components/UiMembershipEmailSuccess.vue'
import UiMembershipError from '~/components/UiMembershipError.vue'
import UiMembershipSpinner from '~/components/UiMembershipSpinner.vue'

export default {
  components: {
    ContainerMembershipLoginWithGoogle,
    ContainerMembershipLoginWithFacebook,
    ContainerMembershipLoginWithEmail,
    UiMembershipEmailSuccess,
    UiMembershipError,
    UiMembershipSpinner,
  },
  data() {
    return {
      pageState: 'form',
      emailShowInSuccess: '',
      isFederatedRedirectResultLoading: true,
    }
  },
  async beforeMount() {
    /*
     * When we use firebase.auth().signInWithRedirect(provider)
     * firebase always redirect to the page where federated login at, which is login page
     * so we must get redirect result in the login page too
     * for more info: https://firebase.google.com/docs/auth/web/google-signin
     */
    // TODO: try to move the logics below to the server side to reduce loading time on client side
    try {
      const result = await this.$fire.auth.getRedirectResult()
      this.isFederatedRedirectResultLoading = false
      if (result.user !== null) {
        const destination = await localforage.getItem('mm-login-destination')
        await localforage.removeItem('mm-login-destination')
        window.location.replace(destination)
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
      this.isFederatedRedirectResultLoading = false
      this.handleLoginError()
    }
  },
  methods: {
    handleEmailLoginSuccess(email) {
      this.pageState = 'success'
      this.emailShowInSuccess = email
    },
    handleLoginError() {
      this.pageState = 'error'
    },
    handleBackToForm() {
      this.pageState = 'form'
    },
  },
}
</script>

<style lang="scss" scoped>
.page {
  padding: 0 20px;
  min-height: calc(100vh - 118px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.form-wrapper {
  width: 100%;
  &__federated-login {
    margin: 20px 0 0 0;
  }
  &__separator {
    margin: 20px 0;
  }
  @include media-breakpoint-up(xl) {
    width: 300px;
  }
}

.title {
  text-align: center;
  font-weight: 900;
  font-size: 18px;
  color: #054f77;
}

.federated-login {
  &__login-wrapper {
    margin: 10px 0 0 0;
  }
}
.federated-login-loading-wrapper {
  border: 2px solid #4a4a4a;
  width: 100%;
  height: 38px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.separator {
  font-size: 16px;
  color: #4a4a4a;
  display: flex;
  align-items: center;
  p {
    margin: 0 22px;
  }
  &:before,
  &:after {
    content: '';
    flex: 1 1 auto;
    height: 1px;
    background-color: #4a4a4a;
  }
}
</style>
