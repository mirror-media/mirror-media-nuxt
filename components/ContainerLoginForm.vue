<template>
  <div class="login-form-wrapper">
    <!-- 選擇登入/註冊方式，可以選擇第三方登入，或是使用email登入 -->
    <ContainerLoginFormInitial
      v-if="state === 'initial'"
      :isFederatedRedirectResultLoading="isFederatedRedirectResultLoading"
      :email.sync="email"
      :showHint="showHint"
      :prevAuthMethod="prevAuthMethod"
      @verifyEmailSignInMethod="handleVerifyEmailSignInMethod"
      @goToRegister="handleGoToRegister"
    />
    <!-- 選擇email登入，且該email尚未被註冊過，會顯示註冊UI -->
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
    <!-- 選擇email登入，且該email已被註冊過，會顯示登入UI -->
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
    prevAuthMethod: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      email: '',

      /**
       * UI related state.
       * 1. 值為 initial 時，會顯示元件ContainerLoginFormInitial，該元件用於選擇登入/註冊方式，包含第三方登入/註冊、email&密碼登入註冊等。
       * 2. 當使用者於元件ContainerLoginFormInitial選擇email&密碼登入註冊，且該email尚未被註冊過，會將state的值改為`register`，並顯示元件ContainerLoginFormRegisterWithEmailPassword。
       * 3. 當使用者於元件ContainerLoginFormInitial選擇email&密碼登入註冊，且該email已被註冊過，會將state的值改為`login`，並顯示元件ContainerLoginFormLoginWithPassword。
       * 4. 當使用者於元件ContainerLoginFormInitial選擇email&密碼登入註冊，且該email登入方法為emailLink，會將state的值改為`recoverPassword`，並顯示元件ContainerLoginFormRecoverPassword。
       * Question: 何謂「已被註冊過」？
       *
       * 修改state的值，是透過函式 `handleVerifyEmailSignInMethod`, `handleGoToRegister`, `handleBackToInitial`。
       * 1. handleVerifyEmailSignInMethod於元件 `ContainerLoginFormInitial`中執行
       * 2. `handleGoToRegister`於元件 `ContainerLoginFormInitial`中執行
       * 3. `handleBackToInitial`於元件 `ContainerLoginFormRegisterWithEmailPassword`與 `ContainerLoginFormLoginWithPassword`中執行。
       *
       */
      state: 'initial',
    }
  },
  methods: {
    /**
     *
     * 於元件 `ContainerLoginFormInitial` 的函式 `handleSubmit`中執行。
     * `handleSubmit`會emit一個值，handleVerifyEmailSignInMethod會依據emit的值，決定後續流程。
     * 1. `emailLink`
     *  - 將 state 設置為 `recoverPassword`
     * 2. `password`
     *  - 將 state 設置為 `login`
     *  - emit 事件 `setPrevAuthMethod`，將父元件 `pages/login.vue` 的值 `prevAuthMethod` 設為 `'email'`
     *  - emit 事件 `setShowHint`，將父元件 `pages/login.vue` 的值 `showHint` 設為 `true`
     * 3. 'google.com', 'facebook.com', 'apple.com':
     *  - emit 事件 `setPrevAuthMethod`，將父元件 `pages/login.vue` 的值 `prevAuthMethod` 設為對應的值
     *  - emit 事件 `setShowHint`，將父元件 `pages/login.vue` 的值 `showHint` 設為 `true`
     *  - （用意不明）清空this.email
     *
     * `handleSubmit`具體內容請詳見該元件。
     */
    handleVerifyEmailSignInMethod(value) {
      switch (value) {
        case 'emailLink':
          this.state = 'recoverPassword'
          break

        case 'password':
          this.state = 'login'
          this.$emit('setPrevAuthMethod', 'email')
          this.$emit('setShowHint', true)
          break

        case 'google.com':
          this.$emit('setPrevAuthMethod', 'Google')
          this.$emit('setShowHint', true)
          this.email = '' // clear email input field (TODO)

          break

        case 'facebook.com':
          this.$emit('setPrevAuthMethod', 'Facebook')
          this.$emit('setShowHint', true)
          this.email = '' // clear email input field (TODO)

          break

        case 'apple.com':
          this.$emit('setPrevAuthMethod', 'Apple')
          this.$emit('setShowHint', true)
          this.email = '' // clear email input field (TODO)

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
      this.$emit('setShowHint', false)
    },
  },
}
</script>

<style lang="scss" scoped>
.login-form-wrapper {
  width: 100%;
}
</style>
