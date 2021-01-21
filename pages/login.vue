<template>
  <section class="login">
    <picture class="banner">
      <source
        media="(min-width: 1200px)"
        type="image/webp"
        srcset="~/assets/membership-banner-login-xl.webp"
      />
      <source
        media="(min-width: 1200px)"
        type="image/jpeg"
        srcset="~/assets/membership-banner-login-xl.jpg"
      />

      <source
        media="(min-width: 768px)"
        type="image/webp"
        srcset="~/assets/membership-banner-login-md.webp"
      />
      <source
        media="(min-width: 768px)"
        type="image/jpeg"
        srcset="~/assets/membership-banner-login-md.jpg"
      />

      <source
        type="image/webp"
        srcset="~/assets/membership-banner-login.webp"
      />
      <img src="~/assets/membership-banner-login.jpg" alt="" />
    </picture>

    <div class="container">
      <div class="intro">
        <h1>歡迎加入鏡週刊會員訂閱服務</h1>
        <p>
          在資訊爆炸與碎片的年代，新聞更需回歸純粹，讓閱讀更清澈、真實與深度。因此我們秉持明鏡之心，充份反映事實，反映時代與反映人性，持續挖掘有料內容，以一手原創題材、深度調查報導為宗旨，讓閱聽大眾獲取最完整的資訊。
        </p>
        <p>現在，請立即加入，成為我們的會員，體驗有質量、無干擾的新聞閱讀。</p>
      </div>

      <div v-if="pageState === 'form'" class="form-wrapper">
        <h2 class="form-wrapper__title title">登入</h2>
        <div class="form-wrapper__federated-login federated-login">
          <div class="facebook-login-wrapper">
            <div
              v-show="isFederatedRedirectResultLoading"
              class="federated-login-loading-wrapper"
            >
              <UiMembershipSpinner />
            </div>
            <ContainerMembershipLoginWithFacebook
              v-show="!isFederatedRedirectResultLoading"
            />
          </div>
          <div class="federated-login__login-wrapper google-login-wrapper">
            <div
              v-show="isFederatedRedirectResultLoading"
              class="federated-login-loading-wrapper"
            >
              <UiMembershipSpinner />
            </div>
            <ContainerMembershipLoginWithGoogle
              v-show="!isFederatedRedirectResultLoading"
            />
          </div>
        </div>
        <div class="form-wrapper__separator separator">
          <p>或</p>
        </div>
        <ContainerMembershipLoginWithEmail
          @success="handleEmailLoginSuccess"
          @error="handleLoginError"
        />
        <p class="form-wrapper__rights rights">
          <span>繼續使用代表您同意與接受</span>
          <span>
            鏡傳媒的
            <a href="https://www.mirrormedia.mg/story/service-rule">
              《服務條款》
            </a>
            以及
            <a href="https://www.mirrormedia.mg/story/privacy/">
              《隱私政策》
            </a>
          </span>
        </p>
      </div>
      <UiMembershipEmailSuccess
        v-else-if="pageState === 'success'"
        class="success-wrapper"
        :emailInput="emailShowInSuccess"
      />
      <UiMembershipError
        v-else-if="pageState === 'error'"
        class="error-wrapper"
        @backToForm="handleBackToForm"
      />
    </div>
  </section>
</template>

<script>
import ContainerMembershipLoginWithGoogle from '~/components/ContainerMembershipLoginWithGoogle.vue'
import ContainerMembershipLoginWithFacebook from '~/components/ContainerMembershipLoginWithFacebook.vue'
import ContainerMembershipLoginWithEmail from '~/components/ContainerMembershipLoginWithEmail.vue'
import UiMembershipEmailSuccess from '~/components/UiMembershipEmailSuccess.vue'
import UiMembershipError from '~/components/UiMembershipError.vue'
import UiMembershipSpinner from '~/components/UiMembershipSpinner.vue'
import userCreate from '~/apollo/mutations/userCreate.gql'
import loginDestination from '~/utils/login-destination'

export default {
  apollo: {
    $client: 'saleorClient',
  },
  components: {
    ContainerMembershipLoginWithGoogle,
    ContainerMembershipLoginWithFacebook,
    ContainerMembershipLoginWithEmail,
    UiMembershipEmailSuccess,
    UiMembershipError,
    UiMembershipSpinner,
  },
  data() {
    return {
      pageState: 'form',
      emailShowInSuccess: '',
      isFederatedRedirectResultLoading: true,
    }
  },
  async beforeMount() {
    /*
     * When we use firebase.auth().signInWithRedirect(provider)
     * firebase always redirect to the page where federated login at, which is login page
     * so we must get redirect result in the login page too
     * for more info: https://firebase.google.com/docs/auth/web/google-signin
     */
    // TODO: try to move the logics below to the server side to reduce loading time on client side
    try {
      const result = await this.$fire.auth.getRedirectResult()
      this.isFederatedRedirectResultLoading = false
      if (result.user !== null) {
        await this.$apollo.mutate({
          mutation: userCreate,
          variables: {
            email: this.$store.state.membership.userEmail,
            firebaseId: this.$store.state.membership.userUid,
          },
        })

        // redirect to page where user try to login
        await loginDestination.redirect()
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
      this.isFederatedRedirectResultLoading = false
      this.handleLoginError()
    }
  },
  methods: {
    handleEmailLoginSuccess(email) {
      this.pageState = 'success'
      this.emailShowInSuccess = email
    },
    handleLoginError() {
      this.pageState = 'error'
    },
    handleBackToForm() {
      this.pageState = 'form'
    },
  },
}
</script>

<style lang="scss" scoped>
.login {
  padding-bottom: 24px;
  @include media-breakpoint-up(md) {
    padding-bottom: 48px;
    background-color: #f2f2f2;
  }
  @include media-breakpoint-up(xl) {
    padding-bottom: 60px;
  }
}

.banner {
  display: block;
  margin-bottom: 48px;
  @include media-breakpoint-up(xl) {
    margin-bottom: 60px;
  }

  img {
    width: 100%;
    height: auto;
  }
}

.container {
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

$font-size--intro: 18px;
$font-size--intro--xl: 20px;
$line-height--intro: 1.6;

.intro {
  color: #4a4a4a;
  font-size: $font-size--intro;
  line-height: $line-height--intro;
  margin-bottom: 24px;
  max-width: 608px;
  @include media-breakpoint-up(md) {
    margin-bottom: 48px;
  }
  @include media-breakpoint-up(xl) {
    font-size: $font-size--intro--xl;
    margin-bottom: 60px;
    max-width: 875px;
  }

  p + p {
    margin-top: $font-size--intro * $line-height--intro;
    @include media-breakpoint-up(xl) {
      margin-top: $font-size--intro--xl * $line-height--intro;
    }
  }
}

h1 {
  font-size: 28px;
  line-height: 1.46;
  letter-spacing: 1px;
  text-align: center;
  margin-bottom: 16px;
  @include media-breakpoint-up(md) {
    margin-bottom: 20px;
  }
  @include media-breakpoint-up(xl) {
    font-size: 32px;
    letter-spacing: 1.2px;
    margin-bottom: 32px;
  }
}

.form-wrapper {
  width: 100%;
  max-width: 424px;

  &__federated-login {
    margin: 20px 0 0 0;
  }
  &__separator {
    margin: 20px 0;
  }
  &__rights {
    margin: 20px 0 0 0;
  }
  @include media-breakpoint-up(xl) {
    width: 300px;
  }
}

.title {
  text-align: center;
  font-weight: 900;
  font-size: 18px;
  color: #054f77;
}

.federated-login {
  &__login-wrapper {
    margin: 10px 0 0 0;
  }
}
.federated-login-loading-wrapper {
  border: 2px solid #4a4a4a;
  width: 100%;
  height: 38px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.separator {
  font-size: 16px;
  color: #4a4a4a;
  display: flex;
  align-items: center;
  p {
    margin: 0 22px;
  }
  &:before,
  &:after {
    content: '';
    flex: 1 1 auto;
    height: 1px;
    background-color: #4a4a4a;
  }
}

.rights {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.66);
  line-height: 18px;
  a {
    color: skyblue;
  }
}
</style>
