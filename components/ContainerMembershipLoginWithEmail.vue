<template>
  <form class="login-form-wrapper__form form" novalidate @submit.prevent>
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
      <UiMembershipSpinner v-if="isLoading" :color="'white'" />
      <template v-else>登入</template>
    </button>
  </form>
</template>

<script>
import localforage from 'localforage'
import UiMembershipEmailInput from '~/components/UiMembershipEmailInput.vue'
import UiMembershipSpinner from '~/components/UiMembershipSpinner.vue'

/*
 * Firebase Authenticate with Firebase Using Email Link flow.
 * https://github.com/mirror-media/mirror-media-nuxt/wiki/Firebase-Email-Authenticate-Flow
 * This component just implement the 1. part below in the flow and store the email for further email validation in 3. part.
 */

export default {
  components: {
    UiMembershipEmailInput,
    UiMembershipSpinner,
  },
  data() {
    return {
      shouldShowInvalidHint: false,
      isEmailInputValid: false,
      emailInput: '',
      shouldRememberMe: false,
      isLoading: false,
    }
  },

  methods: {
    async handleSubmit() {
      this.shouldShowInvalidHint = true
      if (this.isEmailInputValid) {
        this.isLoading = true
        await this.sendSignInLinkToEmail()
        this.isLoading = false
      }
    },
    handleError(e) {
      // eslint-disable-next-line no-console
      console.error(e)
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
        iOS: {
          bundleId: 'com.mirrormedia.news',
        },
        android: {
          packageName: 'com.mirrormedia.news',
          installApp: true,
          minimumVersion: '12',
        },
        dynamicLinkDomain: 'mirrormedia.page.link',
      }
      try {
        await this.$fire.auth.sendSignInLinkToEmail(
          this.emailInput,
          actionCodeSettings
        )
        await localforage.setItem('emailForSignIn', this.emailInput)
        await localforage.setItem(
          'mm-login-destination',
          this.$route.query.destination ?? '/'
        )
        this.$emit('success', this.emailInput)
      } catch (e) {
        this.handleError(e)
        this.$emit('error')
      }
    },
    handleInputValidStateChange(value) {
      this.isEmailInputValid = value
    },
    handleEmailInput(value) {
      this.emailInput = value
    },
  },
}
</script>

<style lang="scss" scoped>
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
</style>
