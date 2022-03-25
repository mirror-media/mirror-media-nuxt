<template>
  <div class="login-form-register-with-email-password">
    <h1 class="title">Email 註冊</h1>
    <div class="login-form-register-with-email-password__inputs inputs">
      <UiMembershipInputEmailValidation
        :emailProps="email"
        @input="handleInputEmail"
        @inputValidStateChange="handleInputValidStateChangeEmail"
      />
      <UiMembershipInputPasswordValidation
        class="inputs__password"
        @input="handleInputPassword"
        @inputValidStateChange="handleInputValidStateChangePassword"
      />
    </div>
    <div class="login-form-register-with-email-password__buttons buttons">
      <p
        v-show="isDuplicateEmailMember"
        class="buttons__duplicate-email-member-hint"
      >
        這個 Email 已經註冊過囉
      </p>
      <UiMembershipButtonPrimary
        :disabled="!canRegister || isDuplicateEmailMember"
        @click.native="handleSubmit"
      >
        <UiMembershipLoadingIcon v-if="isLoading" />
        <p v-else>註冊會員</p>
      </UiMembershipButtonPrimary>
      <UiMembershipButtonSecondary
        class="buttons__go-back"
        @click.native="handleGoBack"
      >
        <p>回上一步</p>
      </UiMembershipButtonSecondary>
    </div>
    <UiMembershipRightsCaveat
      class="login-form-register-with-email-password__rights-caveat"
    />
  </div>
</template>

<script>
import UiMembershipInputEmailValidation from './UiMembershipInputEmailValidation.vue'
import UiMembershipInputPasswordValidation from './UiMembershipInputPasswordValidation.vue'
import UiMembershipButtonPrimary from './UiMembershipButtonPrimary.vue'
import UiMembershipButtonSecondary from './UiMembershipButtonSecondary.vue'
import UiMembershipLoadingIcon from './UiMembershipLoadingIcon.vue'
import UiMembershipRightsCaveat from './UiMembershipRightsCaveat.vue'
import { useMemberSubscribeMachine } from '~/xstate/member-subscribe/compositions'

export default {
  components: {
    UiMembershipInputEmailValidation,
    UiMembershipInputPasswordValidation,
    UiMembershipButtonPrimary,
    UiMembershipLoadingIcon,
    UiMembershipButtonSecondary,
    UiMembershipRightsCaveat,
  },
  props: {
    emailProps: {
      type: String,
      default: '',
    },
  },
  setup() {
    const { state, send } = useMemberSubscribeMachine()
    return {
      stateMembershipSubscribe: state,
      sendMembershipSubscribe: send,
    }
  },
  data() {
    return {
      email: '',
      isEmailValid: false,
      password: '',
      isPasswordValid: false,
      isLoading: false,
      isDuplicateEmailMember: false,
    }
  },
  computed: {
    canRegister() {
      return this.isEmailValid && this.isPasswordValid
    },
  },
  watch: {
    email() {
      if (this.isDuplicateEmailMember) {
        this.isDuplicateEmailMember = false
      }
    },
  },
  beforeMount() {
    if (this.emailProps) {
      this.email = this.emailProps
    }
  },
  methods: {
    handleInputEmail(value) {
      this.email = value
    },
    handleInputValidStateChangeEmail(value) {
      this.isEmailValid = value
    },

    handleInputPassword(value) {
      this.password = value
    },
    handleInputValidStateChangePassword(value) {
      this.isPasswordValid = value
    },

    async handleSubmit() {
      this.isLoading = true
      this.sendMembershipSubscribe('送出')
      try {
        const { user } = await this.$fire.auth.createUserWithEmailAndPassword(
          this.email,
          this.password
        )

        this.isLoading = false
        this.$emit('registerSuccess', user)
      } catch (e) {
        this.isLoading = false
        if (e.code === 'auth/email-already-in-use') {
          this.isDuplicateEmailMember = true
        } else {
          this.$emit('registerFail', e)
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
.login-form-register-with-email-password {
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
  &__rights-caveat {
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
  &__password {
    margin: 16px 0 0 0;
  }
}

.buttons {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  &__duplicate-email-member-hint {
    font-size: 16px;
    line-height: 150%;
    text-align: center;
    color: #e51731;
    margin: 0 0 12px 0;
  }
  &__go-back {
    font-size: 18px !important;
    margin: 16px 0 0 0;
  }
}
</style>
