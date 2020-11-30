<template>
  <section class="page">
    <div class="wrapper">
      <h1 class="page__title title">你確定要刪除會員嗎？</h1>
      <div class="page__description description">
        <p class="description__paragraph">
          <span>你的會員帳號為：</span>
          <span class="current-member-email" v-text="currentMemberEmail" />
        </p>
        <p class="description__paragraph">
          <span>刪除後即無法復原，</span>
          <span>將無法享有鏡週刊會員獨享服務</span>
        </p>
      </div>
      <div class="page__button-wrapper button-wrapper">
        <button class="router-back-button" @click="handleRouterBackClick">
          不刪除，回前頁
        </button>
        <button class="confirm-cancel-button">確認刪除</button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  computed: {
    currentMemberEmail() {
      return this.$store.state.membership.user.email
    },
  },
  methods: {
    handleRouterBackClick() {
      this.$router.back()
    },
  },
}
</script>

<style lang="scss" scoped>
.page {
  min-height: calc(100vh - 118px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &__description,
  &__button-wrapper {
    margin: 40px 0 0 0;
  }
}

.wrapper {
  padding: 40px 20px;
}

.title {
  font-weight: bold;
  font-size: 20px;
  letter-spacing: 2px;
  color: #d0021b;
  text-align: center;
}

.description {
  font-size: 18px;
  line-height: 32px;
  color: #4a4a4a;
  display: flex;
  flex-direction: column;
  align-items: center;
  &__paragraph {
    display: flex;
    flex-direction: column;
    align-items: center;
    @include media-breakpoint-up(xl) {
      flex-direction: row;
      justify-content: center;
    }
  }
}
.current-member-email {
  word-break: break-all;
  text-align: center;
}

.button-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  button + button {
    margin: 20px 0 0 0;
  }
}
.router-back-button {
  width: 100%;
  max-width: 240px;
  height: 60px;
  background-color: #204f74;
  color: white;
  font-size: 20px;
}
.confirm-cancel-button {
  width: 100%;
  max-width: 240px;
  height: 60px;
  background-color: white;
  color: #d0021b;
  border: 1px solid #d0021b;
  font-size: 20px;
}
</style>
