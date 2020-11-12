<template>
  <div class="after-form-submit-wrapper">
    <h1>
      <span>請到信箱收取驗證信件，</span>
      <span>即可進行會員登入！</span>
    </h1>
    <div>
      <p>
        <span>登入鏡週刊的連結已寄送至 &nbsp;</span>
        <span v-text="emailInput"></span>
      </p>
      <p>
        <span>請收信並點擊信件中連結，</span>
        <span>即可登入鏡週刊。</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    emailInput: {
      type: String,
      required: true,
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
