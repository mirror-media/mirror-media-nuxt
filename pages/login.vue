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
          :showHint="showHint"
          :prevAuthMethod="prevAuthMethod"
          @setShowHint="setShowHint"
          @setPrevAuthMethod="setPrevAuthMethod"
          @registerSuccess="handleRegisterSuccess"
          @registerFail="handleRegisterFail"
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
import redirectDestination from '~/utils/redirect-destination'

export default {
  /**
   * apollo configuration, see `apollo-config-member-subscription.js`
   */
  apollo: {
    $client: 'memberSubscription',
  },
  components: {
    UiMembershipLink,
    UiMembershipButtonSecondary,
    UiLoginBanner,
    UiLoginIntro,
    ContainerLoginForm,
  },

  /**
   * 如果已經登入的話，redirect 到section/member頁
   */
  middleware({ store, redirect }) {
    if (store.getters['membership/isLoggedIn']) {
      redirect('/section/member')
    }
  },
  data() {
    return {
      /**
       * 登入/註冊的狀態
       * @type { 'form' |  'registerSuccess' | 'registerError' | 'loginError'}
       * question: 為什麼沒有 loginSuccess?
       */
      state: 'form',

      /**
       * UI related state, 用於顯示倒計時秒數。
       */
      registerSuccessTimerCount: 3,

      /**
       * UI related state,用於顯示loading icon。
       * 跳轉後是否顯示載入中icon，預設為true。當methods `handleFederatedRedirectResult`執行並取得跳轉後資訊，則將 assign 其值為 false。
       */
      isFederatedRedirectResultLoading: true,

      /**
       * （推測）
       * 登入的方式
       * 用途：確認這個email是用什麼方式登入的
       * @type { '' | 'Google' | 'Facebook' | 'Apple' | 'email'}
       *
       */
      prevAuthMethod: '',

      /**
       * UI related state，用於顯示是否顯示hint。
       * hint 於 `ContainerLoginFormInitial.vue` 中顯示。
       */
      showHint: false,
    }
  },
  async beforeMount() {
    // 將跳轉的目標path寫入瀏覽器儲存空間。
    await redirectDestination.set(this.$route)
    await this.handleFederatedRedirectResult()
  },

  methods: {
    /**
     * 送member error log，並且登出
     * 用於函式 `handleLoginSuccess`中（登入失敗時）、handleRegisterFail（註冊失敗時）
     */
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

    /**
     * callback function，會於function `handleRegisterSuccess`中呼叫，
     * 將state改為registerSuccess，並於三秒後執行跳轉。
     */
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

    /**
     * 會在註冊成功後執行。實際上會在元件 `ContainerLoginFormRegisterWithEmailPassword`的methods `handleSubmit` 中被呼叫。
     * 該函式會執行兩個 function:
     * 1. 執行非同步 vuex dispatch `membership/LOGIN_PAGE_ON_AUTH_STATE_CHANGED_ACTION`。（如果失敗的話則執行 this.handleError）
     * 2. 執行函式 showRegisterSuccessAndRedirectToSectionMember
     * Question: catch 的錯誤處理是否要調整？
     *
     */
    async handleRegisterSuccess(authUser) {
      try {
        const result = await this.$store.dispatch(
          'membership/LOGIN_PAGE_ON_AUTH_STATE_CHANGED_ACTION',
          {
            authUser,
            mode: 'register',
            isNewUser: true,
          }
        )

        if (result.error) {
          await this.handleError({
            type: 'gatewayFailUserCreate',
            email: authUser.email,
            error: result.error,
          })
          this.state = 'registerError'
          return
        }

        this.showRegisterSuccessAndRedirectToSectionMember()
      } catch {
        this.state = 'registerError'
      }
    },

    /**
     *
     * 用於註冊失敗時的函式。實際上會於元件`ContainerLoginFormRegisterWithEmailPassword`的methods `handleSubmit` 中被呼叫。
     */
    async handleRegisterFail(error) {
      this.state = 'registerError'
      await this.handleError(error)
    },

    /**
     * 會在登入成功後執行。實際上會在元件`ContainerLoginFormLoginWithPassword` 的methods `handleSubmit` 中被呼叫。
     * 該函式會執行兩個 function:
     * 1. 執行非同步 vuex dispatch `membership/LOGIN_PAGE_ON_AUTH_STATE_CHANGED_ACTION`。（如果失敗的話則執行 this.handleError）
     * 2. 執行函式 redirectDestination.redirect
     *
     * Question: 是否要新增try catch 來執行錯誤處理?
     *
     */
    async handleLoginSuccess(authUser, isNewUser) {
      const result = await this.$store.dispatch(
        'membership/LOGIN_PAGE_ON_AUTH_STATE_CHANGED_ACTION',
        {
          authUser,
          mode: 'login',
          isNewUser,
        }
      )

      if (result.error) {
        await this.handleError({
          type: 'gatewayFailUserCreate',
          email: authUser.email,
          error: result.error,
        })
        this.state = 'loginError'
        return
      }

      await redirectDestination.redirect()
      await Promise.resolve()
    },

    /**
     *
     * 用於登入失敗時的函式。實際上會於元件 `ContainerLoginFormLoginWithPassword` 的methods `handleSubmit` 中被呼叫。
     */
    async handleLoginFail(error) {
      this.state = 'loginError'
      await this.handleError(error)
    },

    /**
     * redirect到登入頁時，取得是否已經登入，以及使用者的登入資訊。
     * @see https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#getredirectresult
     */
    async handleFederatedRedirectResult() {
      try {
        const result = await this.$fire.auth.getRedirectResult()
        this.isFederatedRedirectResultLoading = false

        if (result.user !== null) {
          const isNewUser = !!result?.additionalUserInfo?.isNewUser
          await this.handleLoginSuccess(result.user, isNewUser)
        }
      } catch (e) {
        this.isFederatedRedirectResultLoading = false
        console.log(e)

        /*
         * (3rd party auth error happends here)
         * if login with Google or email/password before,
         * and next time login with Facebook(same email as above)
         * it'll cause error, e.code = auth/account-exists-with-different-credential
         */
        if (e.code === 'auth/account-exists-with-different-credential') {
          const responseArray =
            await this.$fire.auth.fetchSignInMethodsForEmail(e.email)
          const prevAuthMethod = responseArray?.[0]

          // Question: 這段用途？
          switch (prevAuthMethod) {
            case 'google.com':
              this.prevAuthMethod = 'Google'
              break
            case 'facebook.com':
              this.prevAuthMethod = 'Facebook'
              break
            case 'apple.com':
              this.prevAuthMethod = 'Apple'
              break
            case 'password':
              this.prevAuthMethod = 'email'
              break

            default:
              this.prevAuthMethod = prevAuthMethod
              break
          }
          this.showHint = true
        } else {
          // handle other 3rd party auth error
          await this.handleLoginFail({
            type: 'signInFailFederated',
            email: e.email,
            error: e,
          })
        }
      }
    },
    setShowHint(boolean) {
      this.showHint = boolean
    },

    /**
     * 修改 data `this.prevAuthMethod`
     * 該函式會於元件 `ContainerLoginForm` 中執行。
     */
    setPrevAuthMethod(method) {
      this.prevAuthMethod = method
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
