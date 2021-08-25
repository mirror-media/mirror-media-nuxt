<template>
  <div class="login-form-wrapper">
    <ContainerLoginFormInitial
      v-if="state === 'initial'"
      :isFederatedRedirectResultLoading="isFederatedRedirectResultLoading"
      :email.sync="email"
      :showHint="showHint"
      @verifyEmailSignInMethod="handleVerifyEmailSignInMethod"
      @goToRegister="handleGoToRegister"
    />
    <ContainerLoginFormRegisterWithEmailPassword
      v-else-if="state === 'register'"
      :emailProps="email"
      @registerSuccess="(user) => $emit('registerSuccess', user)"
      @registerFail="
        (e) =>
          $emit('registerFail', {
            type: 'registerFailEmailPassword',
            email,
            error: e,
          })
      "
      @back="handleBackToInitial"
    />
    <ContainerLoginFormLoginWithPassword
      v-else-if="state === 'login'"
      :email="email"
      @loginSuccess="(v) => $emit('loginSuccess', v)"
      @loginFail="
        (e) =>
          $emit('loginFail', {
            type: 'signInFailEmailPassword',
            email,
            error: e,
          })
      "
      @back="handleBackToInitial"
    />
    <ContainerLoginFormRecoverPassword
      v-else-if="state === 'recoverPassword'"
      :email="email"
    />
  </div>
</template>

<script>
import ContainerLoginFormInitial from './ContainerLoginFormInitial.vue'
import ContainerLoginFormRegisterWithEmailPassword from './ContainerLoginFormRegisterWithEmailPassword.vue'
import ContainerLoginFormLoginWithPassword from './ContainerLoginFormLoginWithPassword.vue'
import ContainerLoginFormRecoverPassword from './ContainerLoginFormRecoverPassword.vue'

export default {
  components: {
    ContainerLoginFormInitial,
    ContainerLoginFormRegisterWithEmailPassword,
    ContainerLoginFormLoginWithPassword,
    ContainerLoginFormRecoverPassword,
  },
  props: {
    isFederatedRedirectResultLoading: {
      type: Boolean,
      default: true,
    },
    showHint: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      email: '',
      state: 'initial',
    }
  },
  methods: {
    handleVerifyEmailSignInMethod(value) {
      switch (value) {
        case 'emailLink':
          this.state = 'recoverPassword'
          break

        case 'password':
          this.state = 'login'
          this.$emit('setShowHint', false)
          break

        // this email has been used by google/facebook auth
        case 'google.com':
        case 'facebook.com':
          this.email = '' // clear email input field (TODO)
          this.$emit('setShowHint', true)
          break

        default:
          this.state = 'initial'
          break
      }
    },
    handleGoToRegister() {
      this.state = 'register'
    },
    handleBackToInitial() {
      this.state = 'initial'
    },
  },
}
</script>

<style lang="scss" scoped>
.login-form-wrapper {
  width: 100%;
}
</style>
