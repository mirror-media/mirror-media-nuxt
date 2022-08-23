<template>
  <div class="magazine">
    <div>月費、年費會員免費線上閱讀動態雜誌</div>
    <button
      type="button"
      data-user-behavior-description="read-magazine"
      @click="enterMagazinePage"
    >
      線上閱讀
    </button>
  </div>
</template>

<script>
export default {
  name: 'UiMagazineAfterArticle',
  methods: {
    enterMagazinePage() {
      window.location.href = '/magazine/'
    },
  },
}
</script>

<style lang="scss" scoped>
.magazine {
  margin: 24px 0;
  font-size: 24px;
  line-height: 36px;
  text-align: center;
  background-color: #fff;
  padding: 20px;
  color: #054f77;
  border: 1px solid rgba(155, 155, 155, 0.2);
  box-shadow: 0px 0px 20px -4px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  @include media-breakpoint-up(xl) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 32px;
    font-size: 20px;
    width: 640px;
    margin-right: auto;
    margin-left: auto;
  }

  button {
    width: 100%;
    background-color: #1d9fb8;
    border-radius: 2px;
    line-height: 1.38;
    color: #fff;
    padding: 12px 4px;
    margin-top: 16px;
    font-size: 18px;
    line-height: 25px;
    @include media-breakpoint-up(xl) {
      margin-top: 0;
      max-width: 170px;
      line-height: 27px;
    }
  }
}
</style>
