<template>
  <div class="invite-to-login">
    <h1 class="invite-to-login__title title">歡迎加入鏡會員，閱讀完整文章</h1>
    <a
      class="invite-to-login__become-member-link become-member-link"
      :href="loginUrl"
    >
      成為會員
    </a>
    <UiPremiumLoginNow
      class="invite-to-login__paragraph"
      @login="navigateToLoginPage"
    />
  </div>
</template>

<script>
import UiPremiumLoginNow from '~/components/UiPremiumLoginNow.vue'

export default {
  components: {
    UiPremiumLoginNow,
  },
  computed: {
    loginUrl() {
      const currentPagePath = this.$route?.fullPath
      return `/login?destination=${currentPagePath}`
    },
  },
  methods: {
    navigateToLoginPage() {
      window.location.assign(this.loginUrl)
    },
  },
}
</script>

<style lang="scss" scoped>
.invite-to-login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px 20px;
  background: #ffffff;
  border: 1px solid rgba(155, 155, 155, 0.2);
  box-sizing: border-box;
  box-shadow: 0px 0px 20px -4px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  position: relative;
  @include media-breakpoint-up(xl) {
    align-items: flex-start;
    padding: 32px;
  }
  &__become-member-link {
    margin: 24px 0 0 0;
    @include media-breakpoint-up(xl) {
      position: absolute;
      right: 32px;
      margin: auto 0;
    }
  }
  &__paragraph {
    margin: 16px 0 0 0;
    @include media-breakpoint-up(xl) {
      margin: 10px 0 0 0;
    }
  }
}

.title {
  font-weight: 500;
  font-size: 24px;
  line-height: 36px;
  text-align: center;
  color: #054f77;
}

.become-member-link {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 232px;
  padding: 12px 48px;
  background: #1d9fb8;
  border-radius: 2px;
  color: white;
  font-size: 18px;
  &:hover {
    background: linear-gradient(
        0deg,
        rgba(5, 79, 119, 0.5),
        rgba(5, 79, 119, 0.5)
      ),
      #1d9fb8;
  }
  @include media-breakpoint-up(xl) {
    width: 170px;
  }
}
</style>
