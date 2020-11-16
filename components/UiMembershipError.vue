<template>
  <div class="after-form-submit-wrapper">
    <h1>登入失敗</h1>
    <div>
      <p class="row">
        <span>請點選</span>
        <button class="back-to-form-button" @click="handleBackToForm">
          此連結
        </button>
        <span>重新登入，</span>
      </p>
      <p>
        <span>或是聯繫客服 &nbsp;</span>
        <span>
          <a
            href="mailto:service@mirrormedia.mg"
            target="_blank"
            rel="noopener noreferrer"
          >
            service@mirrormedia.mg
          </a>
          &nbsp; / &nbsp;
        </span>
        <span>02-6633-3805 &nbsp;</span>
        <span>我們將有專人為你服務。</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    handleBackToForm() {
      this.$emit('backToForm')
    },
  },
}
</script>

<style lang="scss" scoped>
.after-form-submit-wrapper {
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h1 {
    font-size: 30px;
    color: #204f74;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  div {
    margin: 60px 0 0 0;
  }
  p {
    //margin: 60px 0 0 0;
    line-height: 2;
    font-size: 20px;
    display: flex;
    flex-direction: column;
    &.row {
      flex-direction: row;
    }
    justify-content: center;
    align-items: center;
    @include media-breakpoint-up(xl) {
      flex-direction: row;
    }
  }
  button,
  a {
    color: cornflowerblue;
  }
  button {
    text-decoration: underline;
  }
}
</style>
