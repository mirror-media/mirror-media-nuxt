<template>
  <div class="validate-email">
    <div class="validate-email__wrapper">
      <div class="validate-email__wrapper_title">驗證信箱</div>
      <div class="validate-email__wrapper_content">
        <p>
          您的帳號尚未完成 Email 驗證，請輸入可用來接收驗證信的 Email 信箱。
        </p>
        <p>這個 Email 將會自動綁定您目前的帳號。</p>
      </div>
      <div
        class="validate-email__wrapper_form"
        :class="{ error: $v.email.$error }"
      >
        <div>
          <input
            v-model="email"
            type="text"
            placeholder="name@example.com"
            :disabled="!alterableEmail"
            @input="$v.email.$touch"
          />
          <div
            v-show="!$v.email.email && $v.email.$error"
            class="error__message"
          >
            請輸入有效的 Email 地址
          </div>
          <div
            v-show="!$v.email.required && $v.email.$error"
            class="error__message"
          >
            電子郵件不得為空
          </div>
        </div>
        <div class="validate-email__wrapper_form_status">
          <div
            v-if="isLoading"
            class="validate-email__wrapper_form_status_loading"
          >
            正在寄出信件...
          </div>
          <template v-if="hasSend">
            <template v-if="!isLoading && status === 'success'">
              <div class="validate-email__wrapper_form_status_success">
                Email 已成功寄出
              </div>
              <div class="validate-email__wrapper_form_status_hint">
                沒收到信嗎？請檢查垃圾信件匣，或等候 30 秒重新寄送
              </div>
            </template>
            <div
              v-if="!isLoading && status === 'fail'"
              class="validate-email__wrapper_form_status_error"
            >
              {{ failInfo }}
            </div>
          </template>
        </div>

        <UiMembershipButtonPrimary
          :disabled="isDisable"
          @click.native="handleSubmit"
          ><UiMembershipLoadingIcon v-if="isLoading" />
          <p v-else>{{ buttonWording }}</p></UiMembershipButtonPrimary
        >
      </div>
    </div>
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
import UiMembershipLoadingIcon from '~/components/UiMembershipLoadingIcon.vue'
import UiMembershipButtonPrimary from '~/components/UiMembershipButtonPrimary.vue'
import actionCodeSettingsAppConfig from '~/constants/firebase-action-code-settings-app-config'

export default {
  components: {
    UiMembershipButtonPrimary,
    UiMembershipLoadingIcon,
  },
  middleware({ store, redirect }) {
    if (!store.getters['membership/isLoggedIn']) {
      redirect('/login')
    }
    if (store.state.membership.userEmailVerified) {
      redirect('/subscribe')
    }
  },
  data() {
    return {
      email: '',
      isLoading: false,
      status: 'success',
      hasSend: false,
      validateOn: true,
      frozenTime: 0,
      alterableEmail: true,
      failInfo: 'Email 寄出失敗，請重新再試',
    }
  },
  validations: {
    email: {
      email,
      required,
    },
  },
  computed: {
    isDisable() {
      const validate =
        !this.validateOn ||
        (this.$v.email.email && this.$v.email.required) ||
        !this.alterableEmail
      return !validate || this.isCounting
    },
    isCounting() {
      return this.hasSend && this.status === 'success' && this.frozenTime > 0
    },
    buttonWording() {
      if (!this.isCounting) return '送出'
      return `重新寄送...(${this.frozenTime} 秒)`
    },
  },
  mounted() {
    const currentUser = this.$fire.auth.currentUser

    const { providerData } = currentUser
    this.email = currentUser.email

    let isReadOnly = false
    providerData.forEach((provider) => {
      const logFrom = provider.providerId

      if (logFrom === 'password') {
        isReadOnly = true
      }
      if (logFrom === 'google.com') {
        isReadOnly = true
      }
    })

    this.alterableEmail = !isReadOnly
  },

  methods: {
    setValidateOn() {
      this.validateOn = !this.validateOn
    },
    setOrderStatus(val) {
      this.status = val
    },
    toggleAlterable() {
      this.alterableEmail = !this.alterableEmail
    },
    countDown() {
      this.frozenTime = 30
      const clock = window.setInterval(() => {
        this.frozenTime--
        if (this.frozenTime <= 0) {
          window.clearInterval(clock)
        }
      }, 1000)
    },
    async handleSubmit() {
      if (this.isLoading || this.isDisable) return
      this.isLoading = true

      const currentUser = this.$fire.auth.currentUser
      if (currentUser?.emailVerified) {
        // Although this page is not accessable when user.email has been verified, still check it just in case
        this.isLoading = false
        return
      }

      try {
        if (currentUser.email !== this.email || !currentUser.email) {
          // send verify email and update it
          await currentUser.verifyBeforeUpdateEmail(
            this.email,
            this.createActionCodeSettings()
          )
        } else {
          // send verify email
          await currentUser.sendEmailVerification(
            this.createActionCodeSettings()
          )
        }

        // 驗證信發送完成
        this.isLoading = false
        this.hasSend = true
        this.status = 'success'
        this.countDown()
        window.alert('驗證信已發送到您的信箱，請查收。')
      } catch (error) {
        // 驗證信發送失敗
        this.hasSend = true
        this.isLoading = false
        this.status = 'fail'
        console.log(error.message)

        if (
          error.message ===
          'The email address is already in use by another account.'
        ) {
          this.failInfo =
            '此 Email 已經被註冊，若您是這個 Email 的擁有者，請重新以 Google 帳號登入'
        } else {
          this.failInfo = 'Email 寄出失敗，請重新再試' + error.message
        }
      }
    },
    createActionCodeSettings() {
      return {
        /*
         * URL you want to redirect back to. The domain (www.example.com) for this
         * URL must be in the authorized domains list in the Firebase Console.
         */
        url: createUrl(this.email),

        // This must be true.
        handleCodeInApp: true,

        ...actionCodeSettingsAppConfig,
      }

      function createUrl(email) {
        const origin = window.location.origin
        const path = '/verify-success'

        /*
         * when verified and redirect to verify-success page,
         * we need this email to check which page-state should show
         * (for more detail, see pages/verify-success.vue)
         */

        const queryString = email ? `?email=${email}` : ''
        return `${origin}${path}${queryString}`
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.validate-email {
  padding: 44px 20px;
  @include media-breakpoint-up(sm) {
    background: #f2f2f2;
    display: flex;
    justify-content: center;
    padding: 60px 0;
  }

  &__wrapper {
    @include media-breakpoint-up(sm) {
      max-width: 423px;
      padding: 32px 48px;
      background: #ffffff;
      border: 1px solid rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
      box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.08),
        0px 4px 28px rgba(0, 0, 0, 0.06);
    }

    &_title {
      font-size: 20px;
      line-height: 32px;
      text-align: center;
      color: #4a4a4a;
      margin-bottom: 16px;
    }

    &_content {
      font-size: 16px;
      line-height: 150%;
      color: rgba(0, 0, 0, 0.66);
      margin-bottom: 32px;

      p + p {
        margin-top: 1rem;
      }
    }

    input[type='text'] {
      height: 48px;
      width: 100%;
      padding: 12px;
      border-radius: 2px;
      background: #ffffff;
      border: 1px solid rgba(0, 0, 0, 0.3);
      font-size: 18px;
      line-height: 25px;
      color: rgba(0, 0, 0, 0.87);

      &:focus {
        outline: none;
        border: 1px solid rgba(0, 0, 0, 0.87);
      }

      &:disabled {
        background: #e3e3e3;
        border: 1px solid rgba(0, 0, 0, 0.2);
        color: rgba(0, 0, 0, 0.2);
        font-size: 18px;
        line-height: 25px;
        &::placeholder {
          color: rgba(0, 0, 0, 0.2);
        }
      }
    }

    .error__message {
      margin-top: 8px;
      color: #e51731;
      font-size: 16px;
      line-height: 150%;
    }

    &_form_status {
      margin: 24px 0 12px 0;
      font-size: 16px;
      line-height: 150%;
      color: #9b9b9b;
      text-align: center;
      &_error {
        color: #e51731;
      }
      &_success {
        color: #009045;
      }
      &_hint {
        font-size: 15px;
        line-height: 21px;
        margin: 12px 0 0 0;
      }
    }
  }
}

.error input {
  border: 1px solid #e51731 !important;
}
</style>
