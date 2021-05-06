<template>
  <section class="login">
    <template v-if="state === 'form'">
      <UiLoginBanner />
      <div class="container">
        <UiLoginIntro />
      </div>
      <div class="container container--form">
        <ContainerLoginForm
          :isFederatedRedirectResultLoading="isFederatedRedirectResultLoading"
          @register="handleRegister"
          @loginSuccess="handleLoginSuccess"
          @loginFail="handleLoginFail"
        />
      </div>
    </template>
    <template v-else-if="state === 'registerSuccess'">
      <div class="result-wrapper">
        <h1 class="result-wrapper__title">註冊成功！</h1>
        <h2 class="result-wrapper__subtitle">歡迎加入鏡週刊</h2>
        <p
          class="result-wrapper__description result-wrapper__description--identical-margin"
        >
          將於 {{ registerSuccessTimerCount }} 秒後自動跳轉至會員專區...
        </p>
      </div>
    </template>
    <template v-else-if="state === 'registerError' || 'loginError'">
      <div class="result-wrapper">
        <h1 class="result-wrapper__title">抱歉，出了點狀況...</h1>
        <h2 class="result-wrapper__subtitle">
          請回上一頁{{ state === 'registerError' ? '重試' : '重新登入' }}
        </h2>
        <p class="result-wrapper__description">
          <span> 或是聯繫客服信箱 </span>
          <span>
            <UiMembershipLink href="mailto:mm-onlineservice@mirrormedia.mg">
              mm-onlineservice@mirrormedia.mg
            </UiMembershipLink>
            / 致電
          </span>
          <span> (02)6633-3966 由專人為您服務。 </span>
        </p>
        <UiMembershipButtonSecondary
          class="result-wrapper__button"
          @click.native="state = 'form'"
        >
          <p>回上一頁</p>
        </UiMembershipButtonSecondary>
      </div>
    </template>
  </section>
</template>

<script>
import UiLoginBanner from '~/components/UiLoginBanner.vue'
import UiLoginIntro from '~/components/UiLoginIntro.vue'
import ContainerLoginForm from '~/components/ContainerLoginForm.vue'
import UiMembershipButtonSecondary from '~/components/UiMembershipButtonSecondary.vue'
import UiMembershipLink from '~/components/UiMembershipLink.vue'
import userCreate from '~/apollo/mutations/userCreate.gql'
import loginDestination from '~/utils/login-destination'

export default {
  apollo: {
    $client: 'userClient',
  },
  components: {
    UiMembershipLink,
    UiMembershipButtonSecondary,
    UiLoginBanner,
    UiLoginIntro,
    ContainerLoginForm,
  },
  middleware({ store, redirect }) {
    if (store.getters['membership/isLoggedIn']) {
      redirect('/section/member')
    }
  },
  data() {
    return {
      state: 'form',
      registerSuccessTimerCount: 3,
      isFederatedRedirectResultLoading: true,
    }
  },
  async beforeMount() {
    await loginDestination.set(this.$route)
    await this.handleFederatedRedirectResult()
  },
  methods: {
    async handleError({ type, email, error }) {
      // eslint-disable-next-line no-console
      console.error(error)
      this.$sendMembershipErrorLog({
        email,
        description: error,
        eventType: type,
      })

      await this.$fire.auth.signOut()
    },
    showRegisterSuccessAndRedirectToSectionMember() {
      this.state = 'registerSuccess'
      const timer = setInterval(() => {
        this.registerSuccessTimerCount -= 1
        if (this.registerSuccessTimerCount <= 0) {
          clearInterval(timer)
          window.location.assign('/section/member')
        }
      }, 1000)
    },
    async postCreateUserForRegister(user = {}) {
      const { email, uid } = user
      if (uid) {
        try {
          await this.$apollo.mutate({
            mutation: userCreate,
            variables: {
              email,
              firebaseId: uid,
            },
          })
        } catch (e) {
          await this.handleError({
            type: 'gatewayFailUserCreate',
            email,
            error: e,
          })
          throw e
        }
      }
    },

    async handleRegister(user) {
      try {
        await this.postCreateUserForRegister(user)
        this.showRegisterSuccessAndRedirectToSectionMember()
      } catch {
        this.state = 'registerError'
      }
    },
    async handleLoginSuccess() {
      await loginDestination.redirect()
    },
    async handleLoginFail(error) {
      this.state = 'loginError'
      await this.handleError(error)
    },
    async handleFederatedRedirectResult() {
      try {
        const result = await this.$fire.auth.getRedirectResult()
        this.isFederatedRedirectResultLoading = false
        if (result.user !== null) {
          if (result?.additionalUserInfo?.isNewUser) {
            await this.postCreateUserForRegister(result.user)
          }
          await this.handleLoginSuccess()
        }
      } catch (e) {
        this.isFederatedRedirectResultLoading = false
        await this.handleLoginFail({
          type: 'signInFailFederated',
          email: e.email,
          error: e,
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  &--form {
    padding: 24px 8px 48px;
    @include media-breakpoint-up(md) {
      padding: 0 0 48px 0;
    }
    @include media-breakpoint-up(xl) {
      padding: 0 0 60px 0;
    }
  }
}

.result-wrapper {
  width: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 20px 96px;
  @include media-breakpoint-up(md) {
    max-width: 423px;
    margin: 48px auto 96px auto;
    padding: 32px 48px 24px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.08),
      0px 4px 28px rgba(0, 0, 0, 0.06);
  }
  @include media-breakpoint-up(xl) {
    margin: 60px auto 120px auto;
  }

  &__title,
  &__subtitle {
    font-size: 20px;
    line-height: 32px;
    text-align: center;
    color: #4a4a4a;
  }
  &__description {
    font-size: 15px;
    line-height: 21px;
    color: #9b9b9b;
    margin: 32px 0 0 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    @include media-breakpoint-up(md) {
      margin: 16px 0 0 0;
    }

    span {
      display: inline-block;
      width: 100%;
    }

    &--identical-margin {
      margin: 32px 0 0 0;
    }
  }
  &__button {
    margin: 32px 0 0 0;
    max-width: 280px;
    @include media-breakpoint-up(md) {
      max-width: 327px;
    }
  }
}
</style>
