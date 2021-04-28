<template>
  <div class="login-form">
    <div class="login-form__federated-login federated-login">
      <ContainerMembershipLoginWithFacebookNew
        class="federated-login__facebook"
      />
      <ContainerMembershipLoginWithGoogleNew class="federated-login__google" />
    </div>
    <div class="login-form__separator separator">
      <span>或</span>
    </div>
    <div class="login-form__email-login email-login">
      <UiMembershipInputEmail
        class="email-login__email-input"
        :shouldShowInvalidHint="isSubmitButtonClicked"
        @input="handleInput"
        @inputValidStateChange="handleInputValidStateChange"
      />
      <div class="email-login__submit-button-wrapper">
        <UiMembershipButtonPrimary
          :disabled="!email"
          @click.native="handleSubmit"
        >
          <UiMembershipLoadingIcon v-if="isLoading" />
          <p v-else>下一步</p>
        </UiMembershipButtonPrimary>
      </div>
    </div>
    <div class="login-form__rights-caveat rights-caveat">
      <p>
        <span>繼續使用代表您同意與接受</span>
        <span>
          鏡傳媒的
          <UiMembershipLink
            href="https://www.mirrormedia.mg/story/service-rule"
          >
            《服務條款》
          </UiMembershipLink>
          以及
          <UiMembershipLink href="https://www.mirrormedia.mg/story/privacy/">
            《隱私政策》
          </UiMembershipLink>
        </span>
      </p>
    </div>
  </div>
</template>

<script>
import ContainerMembershipLoginWithFacebookNew from './ContainerMembershipLoginWithFacebookNew.vue'
import ContainerMembershipLoginWithGoogleNew from './ContainerMembershipLoginWithGoogleNew.vue'
import UiMembershipLoadingIcon from './UiMembershipLoadingIcon.vue'
import UiMembershipLink from './UiMembershipLink.vue'
import UiMembershipInputEmail from '~/components/UiMembershipInputEmail.vue'
import UiMembershipButtonPrimary from '~/components/UiMembershipButtonPrimary.vue'

export default {
  components: {
    ContainerMembershipLoginWithFacebookNew,
    ContainerMembershipLoginWithGoogleNew,
    UiMembershipLoadingIcon,
    UiMembershipInputEmail,
    UiMembershipButtonPrimary,
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
      isEmailInputValid: false,
      isSubmitButtonClicked: false,
      isLoading: false,
    }
  },
  methods: {
    async handleSubmit() {
      this.isSubmitButtonClicked = true

      this.isLoading = true
      try {
        const responseArray = await this.$fire.auth.fetchSignInMethodsForEmail(
          this.email
        )

        const isEmailExistWithEmailLinkSignInMethod =
          responseArray?.[0] === 'emailLink'
        const isEmailExistWithEmailPasswordSignInMethod =
          responseArray?.[0] === 'password'
        if (isEmailExistWithEmailLinkSignInMethod) {
          this.$emit('verifyEmailSignInMethod', 'emailLink')
        } else if (isEmailExistWithEmailPasswordSignInMethod) {
          this.$emit('verifyEmailSignInMethod', 'password')
        } else {
          this.$emit('register')
        }
      } catch (e) {
        console.error(e)
      }
      this.isLoading = false
    },
    handleInput(value) {
      this.$emit('update:email', value)
    },
    handleInputValidStateChange(value) {
      this.isEmailInputValid = value
    },
  },
}
</script>

<style lang="scss" scoped>
.login-form {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.08), 0px 4px 28px rgba(0, 0, 0, 0.06);
  padding: 24px 20px 16px;
  @include media-breakpoint-up(md) {
    max-width: 423px;
    margin: 0 auto;
    padding: 32px 48px 24px;
  }

  &__separator {
    margin: 16px 0 0 0;
  }
  &__email-login {
    margin: 16px 0 0 0;
  }
  &__rights-caveat {
    margin: 24px 0 0 0;
  }
}

.federated-login {
  &__google {
    margin: 12px 0 0 0;
  }
}

.separator {
  font-size: 13px;
  line-height: 19px;
  color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  span {
    margin: 0 12px;
  }
  &:before,
  &:after {
    content: '';
    display: inline-block;
    flex: 1 1 auto;
    height: 1px;
    background-color: rgba(0, 0, 0, 0.1);
  }
}

.email-login {
  &__submit-button-wrapper {
    margin: 24px 0 0 0;
  }
}

.rights-caveat {
  font-size: 15px;
  line-height: 21px;
  text-align: center;
  color: rgba(0, 0, 0, 0.66);
}
</style>
