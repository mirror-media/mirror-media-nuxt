<template>
  <form class="login-form-wrapper__form form" novalidate @submit.prevent>
    <UiMembershipEmailInput
      :shouldShowInvalidHint="shouldShowInvalidHint"
      @input="handleEmailInput"
      @inputValidStateChange="handleInputValidStateChange"
    />
    <button class="form__login-button login-button" @click="handleSubmit">
      <UiMembershipSpinner v-if="isLoading" :color="'white'" />
      <template v-else>登入</template>
    </button>
  </form>
</template>

<script>
import localforage from 'localforage'
import redirectDestination from '~/utils/redirect-destination'
import UiMembershipEmailInput from '~/components/UiMembershipEmailInput.vue'
import UiMembershipSpinner from '~/components/UiMembershipSpinner.vue'
import { ENV } from '~/configs/config'

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
    handleError({ email, error }) {
      // eslint-disable-next-line no-console
      console.error(error)
      this.$emit('error', { email, error, type: 'emailLoginSendEmail' })
    },
    createSignInLinkToEmail() {
      const origin = window.location.origin
      const path = '/finishSignUp'
      return `${origin}${path}`
    },
    async sendSignInLinkToEmail() {
      const actionCodeSettingsAppConfig =
        ENV === 'prod' || ENV === 'staging'
          ? {
              iOS: {
                bundleId: 'com.mirrormedia.news',
              },
              android: {
                packageName: 'com.mirrormedia.news',
                installApp: true,
                minimumVersion: '12',
              },
              dynamicLinkDomain: 'mirrorweekly.page.link',
            }
          : {
              iOS: {
                bundleId: 'com.mirrormedia.news.dev',
              },
              android: {
                packageName: 'com.mirrormedia.news.dev',
                installApp: true,
                minimumVersion: '12',
              },
              dynamicLinkDomain: 'mirrormediadev.page.link',
            }
      const actionCodeSettings = {
        /*
         * URL you want to redirect back to. The domain (www.example.com) for this
         * URL must be in the authorized domains list in the Firebase Console.
         */
        url: this.createSignInLinkToEmail(),

        // This must be true.
        handleCodeInApp: true,

        ...actionCodeSettingsAppConfig,
      }
      try {
        await this.$fire.auth.sendSignInLinkToEmail(
          this.emailInput,
          actionCodeSettings
        )
        await localforage.setItem('emailForSignIn', this.emailInput)
        await redirectDestination.set(this.$route)
        this.$emit('success', this.emailInput)
      } catch (e) {
        this.handleError({ email: this.emailInput, error: e })
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
</style>
