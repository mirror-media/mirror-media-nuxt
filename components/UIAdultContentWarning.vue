<template>
  <div v-show="showWarning" class="adult-content-warning">
    <div class="adult-content-warning-container">
      <h2>您即將進入之內容<br />需滿十八歲方可瀏覽</h2>
      <p>
        根據「電腦網路內容分級處理辦法」第六條第三款規定，本網站已於各限制級網頁依照台灣網站分級推廣基金會之規定標示。若您尚未年滿十八歲，請點選離開。若您已滿十八歲，亦不可將本區之內容派發、傳閱、出售、出租、交給或借予年齡未滿18歲的人士瀏覽，或將本網站內容向該人士出示、播放或放映。
      </p>
      <div class="adult-content-warning__action">
        <button class="button accepted" @click="closeWarning">
          是，我已年滿十八歲
        </button>
        <a class="button" href="/">離開</a>
      </div>
    </div>
  </div>
</template>

<script>
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'

export default {
  name: 'UIAdultContentWarning',
  data() {
    return {
      showWarning: true,
    }
  },
  mounted() {
    disableBodyScroll(this.$el)
  },
  beforeDestroy() {
    enableBodyScroll(this.$el)
  },
  methods: {
    closeWarning() {
      this.showWarning = false
      enableBodyScroll(this.$el)
    },
  },
}
</script>

<style lang="scss" scoped>
.adult-content-warning {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  h2 {
    padding: 0 0 20px;
    color: #34495e;
    font-size: 26px;
    line-height: 1.2;
    text-align: center;
    border-bottom: 1px solid #d9d9d9;
    & + p {
      margin: 25px 0 0 0;
    }
  }
  p {
    color: #333;
    font-size: 16px;
    text-align: justify;
    line-height: 1.5;
    & + div {
      margin: 25px 0 0 0;
    }
  }
  .button {
    display: inline-block;
    font-size: 14px;
    padding: 10px 18px;
    background-color: #fff;
    border: 1px solid #c1c2c5;
    border-radius: 5px;
    &.accepted {
      color: #fff;
      background-color: #1087a8;
      border: none;
      &:hover {
        background-color: #0e7ea0;
      }
    }
    + .button {
      margin-left: 10px;
    }
  }
  &-container {
    width: 90%;
    max-width: 500px;
    padding: 20px;
    background-color: #fafafa;
    border-radius: 10px;
    @include media-breakpoint-up(md) {
      padding: 30px;
    }
  }

  &__action {
    text-align: center;
    @include media-breakpoint-up(md) {
      text-align: right;
    }
  }
}
</style>
