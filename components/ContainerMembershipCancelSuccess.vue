<template>
  <div class="wrapper">
    <h1 class="wrapper__title title">已刪除你的帳號</h1>
    <div class="wrapper__description description">
      <p class="description__paragraph">
        <span>我們已經刪除你的會員帳號</span>
      </p>
      <p class="description__paragraph">
        <span>謝謝你使用鏡週刊的會員服務，</span>
        <span>很遺憾要刪除你的帳號</span>
      </p>
      <p class="description__paragraph">
        <span>如果希望再次使用的話，</span>
        <span>歡迎再次註冊！</span>
      </p>
    </div>
    <div class="wrapper__button-wrapper button-wrapper">
      <nuxt-link to="/" replace class="back-to-home-button">回首頁</nuxt-link>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 40px 20px;
  &__description,
  &__button-wrapper {
    margin: 40px 0 0 0;
  }
}

.title {
  font-weight: bold;
  font-size: 20px;
  letter-spacing: 2px;
  color: #204f74;
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

.button-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  button + button {
    margin: 20px 0 0 0;
  }
}
.back-to-home-button {
  width: 100%;
  max-width: 240px;
  height: 60px;
  background-color: #204f74;
  color: white;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
