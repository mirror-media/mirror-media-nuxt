<template>
  <div class="login-form-login-with-password">
    <h1 class="title">輸入密碼</h1>
    <div class="login-form-login-with-password__inputs inputs">
      <UiMembershipInputPasswordErrorHint
        class="inputs__password"
        :shouldShowErrorHint="shouldShowErrorHint"
        @input="handleInputPassword"
        @inputValidStateChange="handleInputValidStateChangePassword"
      />
    </div>
    <div class="login-form-login-with-password__buttons buttons">
      <UiMembershipButtonPrimary
        :disabled="!isPasswordValid"
        @click.native="handleSubmit"
      >
        <UiMembershipLoadingIcon v-if="isLoading" />
        <p v-else>登入會員</p>
      </UiMembershipButtonPrimary>
      <UiMembershipButtonSecondary
        class="buttons__go-back"
        @click.native="handleGoBack"
      >
        <p>回上一步</p>
      </UiMembershipButtonSecondary>
    </div>
    <div class="login-form-login-with-password__links links">
      <UiMembershipLink :href="`/recoverPassword?email=${email}`">
        忘記密碼？
      </UiMembershipLink>
    </div>
  </div>
</template>

<script>
import UiMembershipInputPasswordErrorHint from './UiMembershipInputPasswordErrorHint.vue'
import UiMembershipButtonPrimary from './UiMembershipButtonPrimary.vue'
import UiMembershipButtonSecondary from './UiMembershipButtonSecondary.vue'
import UiMembershipLoadingIcon from './UiMembershipLoadingIcon.vue'
import UiMembershipLink from './UiMembershipLink.vue'

export default {
  components: {
    UiMembershipInputPasswordErrorHint,
    UiMembershipButtonPrimary,
    UiMembershipButtonSecondary,
    UiMembershipLoadingIcon,
    UiMembershipLink,
  },
  props: {
    email: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      password: '',
      isPasswordValid: false,
      isLoading: false,
      shouldShowErrorHint: false,
    }
  },
  methods: {
    handleInputPassword(value) {
      this.password = value
    },
    handleInputValidStateChangePassword(value) {
      this.isPasswordValid = value
    },

    /**
     * 當點擊送出按鈕後，會執行的非同步函式。
     * 會依序執行三件事情：
     * 1. 將狀態 `this.isLoading` 設為true
     * 2. 執行非同步函式 `this.$fire.auth.signInWithEmailAndPassword`
     *    - 如果登入成功的話，會emit 事件 `loginSuccess`。emit後會在父元件 `login.vue`執行函式 `handleLoginSuccess`。
     *    - 如果登入失敗的話，會檢查是否為密碼輸入錯誤，如果是的話則顯示對應的錯誤訊息；反之如果是其他錯誤的話，則emit 事件 `loginFail`，。emit後會在父元件 `login.vue`執行函式 `handleLoginFail`
     * 3. 非同步完畢執行完畢後，將狀態 `this.isLoading` 設為false。
     */
    async handleSubmit() {
      this.isLoading = true
      try {
        const { user = {} } = await this.$fire.auth.signInWithEmailAndPassword(
          this.email,
          this.password
        )

        this.isLoading = false
        this.$emit('loginSuccess', user)
      } catch (e) {
        this.isLoading = false
        if (e.code === 'auth/wrong-password') {
          this.shouldShowErrorHint = true
        } else {
          this.$emit('loginFail', e)
        }
      }
    },

    handleGoBack() {
      this.$emit('back')
    },
  },
}
</script>

<style lang="scss" scoped>
.login-form-login-with-password {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.08), 0px 4px 28px rgba(0, 0, 0, 0.06);
  padding: 24px 20px 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @include media-breakpoint-up(md) {
    width: 423px;
    margin: 0 auto;
    padding: 32px 48px 24px;
  }

  &__inputs {
    margin: 16px 0 0 0;
  }
  &__buttons {
    margin: 24px 0 0 0;
  }
  &__links {
    margin: 24px 0 0 0;
  }
}

.title {
  font-size: 20px;
  line-height: 32px;
  color: #4a4a4a;
}

.inputs {
  width: 100%;
}

.buttons {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  &__go-back {
    font-size: 18px !important;
    margin: 16px 0 0 0;
  }
}

.links {
  display: flex;
  flex-direction: column;
  align-items: center;
  &__member-without-password {
    margin: 12px 0 0 0;
  }
}
</style>
