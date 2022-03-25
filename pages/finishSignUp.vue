<template>
  <section class="page">
    <UiMembershipError
      v-if="doesErrorOccur"
      class="confirm-email-error-wrapper"
      @backToForm="handleBackToForm"
    />
    <template v-else-if="shouldProvideEmailManually">
      <div
        v-if="provideEmailManuallyState === 'form'"
        class="confirm-email-form-wrapper"
      >
        <h1 class="title">登入</h1>
        <form class="page__form form" novalidate @submit.prevent>
          <p class="form__confirm-email-hint confirm-email-hint">
            請輸入你所註冊的 Email，進行登入
          </p>
          <UiMembershipEmailInput
            class="form__email-input"
            :shouldShowInvalidHint="shouldShowInvalidHint"
            @input="handleEmailInput"
            @inputValidStateChange="handleInputValidStateChange"
          />
          <button class="form__login-button login-button" @click="handleSubmit">
            登入
          </button>
        </form>
      </div>
    </template>
  </section>
</template>

<script>
import localforage from 'localforage'
import redirectDestination from '~/utils/redirect-destination'
import UiMembershipError from '~/components/UiMembershipError.vue'
import UiMembershipEmailInput from '~/components/UiMembershipEmailInput.vue'
import { userCreate } from '~/apollo/mutations/userCreate.gql'

/*
 * Firebase Authenticate with Firebase Using Email Link flow.
 * https://github.com/mirror-media/mirror-media-nuxt/wiki/Firebase-Email-Authenticate-Flow
 * This page component is about the 3rd part of the flow
 * For more info: https://firebase.google.com/docs/auth/web/email-link-auth#complete_sign_in_with_the_email_link
 */
export default {
  apollo: {
    $client: 'userClient',
  },
  components: {
    UiMembershipEmailInput,
    UiMembershipError,
  },

  middleware({ app, redirect, req }) {
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`
    if (!app.$fire.auth.isSignInWithEmailLink(fullUrl)) {
      redirect('/')
    }
  },
  data() {
    return {
      emailInput: '',
      isEmailInputValid: false,
      shouldProvideEmailManually: false,
      shouldShowInvalidHint: false,
      provideEmailManuallyState: 'form',
      doesErrorOccur: false,
    }
  },
  async beforeMount() {
    const email = await this.getEmail()
    if (email) {
      await this.signInWithEmail(email)
    } else {
      this.shouldProvideEmailManually = true
    }
  },
  methods: {
    async getEmail() {
      return this.emailInput || (await localforage.getItem('emailForSignIn'))
    },
    handleSubmit() {
      this.shouldShowInvalidHint = true
      if (this.isEmailInputValid) {
        this.signInWithEmail(this.emailInput)
      }
    },
    async signInWithEmail(email) {
      try {
        const result = await this.$fire.auth.signInWithEmailLink(
          email,
          window.location.href
        )
        await localforage.removeItem('emailForSignIn')

        if (result.user !== null) {
          /*
           * different to federated login like Facebook and Google using $fire.auth.getRedirectResult()
           * $fire.auth.signInWithEmailLink is verification with email, not log in with email
           * so onAuthStateChanged will not trigger automatically, we need to dispatch it manually
           * to ensure that user info is store in vuex
           * maybe this is a info: https://stackoverflow.com/questions/54591187/onauthstatechanged-doesnt-get-called-when-email-is-verified-in-flutter
           */
          /*
           * await this.$store.dispatch(
           *   'membership/ON_AUTH_STATE_CHANGED_ACTION',
           *   { authUser: result.user }
           * )
           */

          await this.$apollo.mutate({
            mutation: userCreate,
            variables: {
              email: result.user.email,
              firebaseId: result.user.uid,
            },
          })
        }

        // redirect to page where user try to login
        await redirectDestination.redirect()
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e)
        this.$sendMembershipErrorLog({
          email,
          description: e,
          eventType: 'emailLoginSignIn',
        })
        this.doesErrorOccur = true
      }
    },
    handleInputValidStateChange(value) {
      this.isEmailInputValid = value
    },
    handleEmailInput(value) {
      this.emailInput = value
    },
    handleBackToForm() {
      this.$router.replace('/login')
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

.confirm-email-form-wrapper {
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
  &__login-button,
  &__email-input {
    margin: 20px 0 0 0;
  }
}
.confirm-email-hint {
  font-size: 18px;
  text-align: center;
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
