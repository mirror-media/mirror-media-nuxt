<template>
  <div class="validate-email">
    <div class="validate-email__wrapper">
      <div class="validate-email__wrapper_title">
        {{ verifiedEmail }} 已驗證成功！
      </div>
      <div class="validate-email__wrapper_content">
        <p>{{ hintWording }}</p>
      </div>
      <div class="validate-email__wrapper_form">
        <UiMembershipButtonPrimary @click.native="handleSubmit">
          <p>{{ buttonWording }}</p></UiMembershipButtonPrimary
        >
      </div>
    </div>
  </div>
</template>

<script>
import UiMembershipButtonPrimary from '~/components/UiMembershipButtonPrimary.vue'

export default {
  components: {
    UiMembershipButtonPrimary,
  },

  asyncData(context) {
    const verifiedEmail = context.route.query?.email
    const currentLoggedMemberEmail = context.store.state.membership.userEmail
    return {
      isLoggedIn: !!currentLoggedMemberEmail,
      emailIsDifferent: currentLoggedMemberEmail !== verifiedEmail,
      verifiedEmail,
      currentLoggedMemberEmail,
    }
  },

  computed: {
    hintWording() {
      if (this.isLoggedIn) {
        if (this.emailIsDifferent) {
          return `提醒您，此裝置目前登入帳號為：${this.currentLoggedMemberEmail}`
        } else {
          return ''
        }
      } else {
        return '請重新登入，繼續完成訂購流程'
      }
    },
    buttonWording() {
      if (this.isLoggedIn) {
        if (this.emailIsDifferent) {
          return '換個帳號重新登入'
        } else {
          return '繼續前往付款'
        }
      } else {
        return '重新登入'
      }
    },
  },

  methods: {
    async handleSubmit() {
      const destination = 'subscribe'
      if (this.isLoggedIn) {
        if (this.emailIsDifferent) {
          await this.$fire.auth.signOut()

          // clear the firebase current user state in the store
          this.$store.commit('membership/ON_AUTH_STATE_CHANGED_MUTATION', {
            authUser: {},
          })

          this.$router.push(`/login?destination=%2F${destination}`)
        } else {
          this.$router.push('/subscribe')
        }
      } else {
        this.$router.push(`/login?destination=%2F${destination}`)
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
  }
}

button:focus {
  outline: 0 !important;
}
</style>
