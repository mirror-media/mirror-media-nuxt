<template>
  <div class="login-form-wrapper">
    <ContainerLoginFormInitial
      v-if="state === 'initial'"
      :email.sync="email"
      @verifyEmailSignInMethod="handleVerifyEmailSignInMethod"
      @register="handleRegister"
    />
    <ContainerLoginFormRegisterWithEmailPassword
      v-else-if="state === 'register'"
      :emailProps="email"
      @back="handleBackToInitial"
    />
    <!--    <ContainerLoginFormLoginWithPassword v-else-if="state === 'login'" />-->
    <ContainerLoginFormRecoverPassword
      v-else-if="state === 'recoverPassword'"
      :email="email"
    />
  </div>
</template>

<script>
import ContainerLoginFormInitial from './ContainerLoginFormInitial.vue'
import ContainerLoginFormRegisterWithEmailPassword from './ContainerLoginFormRegisterWithEmailPassword.vue'

// import ContainerLoginFormLoginWithPassword from './ContainerLoginFormLoginWithPassword.vue'
import ContainerLoginFormRecoverPassword from './ContainerLoginFormRecoverPassword.vue'

export default {
  components: {
    ContainerLoginFormInitial,
    ContainerLoginFormRegisterWithEmailPassword,

    // ContainerLoginFormLoginWithPassword,
    ContainerLoginFormRecoverPassword,
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
          break
        default:
          this.state = 'initial'
          break
      }
    },
    handleRegister() {
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
