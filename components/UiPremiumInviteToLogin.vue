<template>
  <div class="invite-to-login">
    <h1 class="invite-to-login__title title">歡迎加入鏡會員，閱讀完整文章</h1>
    <a
      class="invite-to-login__become-member-link become-member-link"
      :href="`/login?destination=${currentPagePath}`"
    >
      成為會員
    </a>
    <p class="invite-to-login__paragraph paragraph">
      <span>已經是會員了？</span>
      <a
        class="paragraph__login-now login-now"
        :href="`/login?destination=${currentPagePath}`"
      >
        立即登入
      </a>
    </p>
  </div>
</template>

<script>
export default {
  computed: {
    currentPagePath() {
      return this.$route.fullPath
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

.paragraph {
  font-size: 16px;
  line-height: 21px;
  text-align: center;
  color: #9b9b9b;
}

.login-now {
  border-bottom: 1px solid #9b9b9b;
  &:hover {
    color: #4a4a4a;
    border-bottom: 1px solid #4a4a4a;
  }
}
</style>
