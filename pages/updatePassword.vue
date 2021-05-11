<template>
  <section class="update-password">
    <div class="wrapper">
      <div class="wrapper__current-password current-password">
        <label>
          <span>目前的密碼</span>
          <UiMembershipInputPasswordErrorHint
            class="input"
            placeholder="輸入目前的密碼"
            :shouldShowErrorHint="shouldShowWrongPasswordHint"
            @input="handleInputCurrentPassword"
          />
        </label>
      </div>
      <div class="wrapper__new-password new-password">
        <label>
          <span>新密碼</span>
          <UiMembershipInputPasswordValidation
            class="input"
            placeholder="輸入 6 位數以上的密碼"
            @input="handleInputNewPassword"
            @inputValidStateChange="handleInputNewPasswordValidStateChange"
          />
        </label>
      </div>
      <UiMembershipButtonPrimary
        class="wrapper__submit-button submit-button"
        :disabled="!isNewPasswordValid"
        @click.native="handleSubmitButtonClick"
      >
        <UiMembershipLoadingIcon v-if="isLoading" />
        <p v-else>儲存</p>
      </UiMembershipButtonPrimary>
    </div>
  </section>
</template>

<script>
import UiMembershipInputPasswordErrorHint from '~/components/UiMembershipInputPasswordErrorHint.vue'
import UiMembershipInputPasswordValidation from '~/components/UiMembershipInputPasswordValidation.vue'
import UiMembershipButtonPrimary from '~/components/UiMembershipButtonPrimary.vue'
import UiMembershipLoadingIcon from '~/components/UiMembershipLoadingIcon.vue'

export default {
  components: {
    UiMembershipLoadingIcon,
    UiMembershipButtonPrimary,
    UiMembershipInputPasswordValidation,
    UiMembershipInputPasswordErrorHint,
  },
  middleware: ['authenticate-sign-in-method-email'],
  data() {
    return {
      currentPassword: '',
      newPassword: '',
      isNewPasswordValid: false,
      isLoading: false,
      shouldShowWrongPasswordHint: false,
    }
  },
  computed: {
    currentUser() {
      return this.$fire.auth.currentUser
    },
  },
  methods: {
    handleInputCurrentPassword(value) {
      this.currentPassword = value
    },
    handleInputNewPassword(value) {
      this.newPassword = value
    },
    handleInputNewPasswordValidStateChange(value) {
      this.isNewPasswordValid = value
    },
    handleError(e) {
      // eslint-disable-next-line no-console
      console.error(e)
      this.$sendMembershipErrorLog({
        email: this.currentUser?.email,
        description: e,
        eventType: 'updatePassword',
      })
    },
    async reAuthCurrentMember() {
      const credential = this.$fireModule.auth.EmailAuthProvider.credential(
        this.currentUser?.email,
        this.currentPassword
      )
      await this.currentUser.reauthenticateWithCredential(credential)
    },
    async handleSubmitButtonClick() {
      this.isLoading = true
      this.shouldShowWrongPasswordHint = false

      try {
        await this.reAuthCurrentMember()
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e)

        if (e.code === 'auth/wrong-password') {
          this.shouldShowWrongPasswordHint = true
        }
        return
      } finally {
        this.isLoading = false
      }

      try {
        await this.currentUser.updatePassword(this.newPassword)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 40px 20px;
  @include media-breakpoint-up(md) {
    padding: 32px 48px;
    max-width: 423px;
    margin: 80px auto;
    border: 1px solid #d8d8d8;
  }

  &__new-password {
    margin: 32px 0 0 0;
  }
  &__submit-button {
    margin: 24px 0 0 0;
  }
}

label {
  span {
    font-size: 20px;
    line-height: 32px;
    color: #4a4a4a;
  }

  .input {
    margin: 12px 0 0 0;
  }
}
</style>
