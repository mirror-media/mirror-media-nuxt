<template>
  <section class="page">
    <div v-if="pageState === 'form'" class="form-wrapper">
      <h1 class="form-wrapper__title title">登入</h1>
      <div class="form-wrapper__federated-login federated-login">
        <ContainerMembershipLoginWithGoogle />
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
import ContainerMembershipLoginWithGoogle from '~/components/ContainerMembershipLoginWithGoogle.vue'
import ContainerMembershipLoginWithEmail from '~/components/ContainerMembershipLoginWithEmail.vue'
import UiMembershipEmailSuccess from '~/components/UiMembershipEmailSuccess.vue'
import UiMembershipError from '~/components/UiMembershipError.vue'

export default {
  components: {
    ContainerMembershipLoginWithGoogle,
    ContainerMembershipLoginWithEmail,
    UiMembershipEmailSuccess,
    UiMembershipError,
  },
  data() {
    return {
      pageState: 'form',
      emailShowInSuccess: '',
    }
  },
  async beforeMount() {
    /*
     * When we use firebase.auth().signInWithRedirect(provider)
     * firebase always redirect to the page where federated login at, which is login page
     * so we must get redirect result in the login page too
     * for more info: https://firebase.google.com/docs/auth/web/google-signin
     */
    try {
      /*
       * TODO: we should implement pending state and layout here
       * because the async request below may take a moment
       * cause the page may not been redirect to home page immediately
       */
      const result = await this.$fire.auth.getRedirectResult()
      if (result.user !== null) {
        this.$router.replace('/')
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
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
