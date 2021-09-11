<template>
  <div class="wrapper">
    <div class="wrapper__card">
      <h1 class="wrapper__title title">目前無法刪除會員</h1>
      <div class="wrapper__description description">
        <p class="description__paragraph">
          <span
            >由於您為 VIP / Premium 會員，享會員專區文章暢讀。如要刪除帳號，請於
            VIP / 訂閱期限到期後操作。</span
          >
        </p>
      </div>
      <div class="wrapper__button-wrapper button-wrapper">
        <a href="/" class="back-to-home-button">回首頁</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.wrapper {
  &__description {
    margin: 4px 0 24px;
  }

  &__card {
    max-width: 423px;
    margin: auto;
    padding: 40px 20px;
    background: #ffffff;

    @include media-breakpoint-up(sm) {
      margin-top: 60px;
      padding: 24px 24px 16px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 4px;
    }
  }
}

.title {
  font-family: 'PingFang TC';
  font-size: 20px;
  line-height: 32px;
  color: rgba(0, 0, 0, 0.87);
}

.description {
  font-family: 'PingFang TC';
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 150%;
  text-align: justify;
  color: rgba(0, 0, 0, 0.66);
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
