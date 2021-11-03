<template>
  <div class="reload">
    <div class="reload__background"></div>
    <div class="reload__hint">
      <p v-for="wording in hintWordings" :key="wording">{{ wording }}</p>
    </div>
    <div
      v-if="!isFailMoreThanThreeTime"
      class="reload__button"
      @click="handleButtonClick"
    >
      重新載入
    </div>
    <a v-else class="reload__button" href="/section/member">回會員專區</a>
  </div>
</template>

<script>
export default {
  props: {
    failTimes: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    isFailMoreThanThreeTime() {
      return this.failTimes >= 3
    },
    hintWordings() {
      const wording = this.isFailMoreThanThreeTime
        ? ['抱歉！目前頁面暫時無法成功讀取', '我們將盡快修復']
        : ['哎呀！讀取出了一點問題', '請重新整理頁面']
      return wording
    },
  },
  methods: {
    handleButtonClick() {
      this.$emit('reload')
    },
  },
}
</script>

<style lang="scss" scoped>
.reload {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 48px;
  position: relative;
  &__background {
    position: absolute;
    bottom: 100%;
    width: 100vw;
    height: 300px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, white 80%);
    left: -20px;
    @include media-breakpoint-up(md) {
      left: calc((100vw - 608px) / 2 * -1);
    }
    @include media-breakpoint-up(xl) {
      width: 720px;
      left: calc(((720px - 640px) / 2) * -1);
    }
  }
  &__button {
    padding: 12px 0px;
    width: 327px;
    height: 48px;
    background: #ffffff;
    border: 1px solid #054f77;
    text-decoration: none !important;
    border-radius: 2px;
    font-size: 18px;
    line-height: 25px;
    color: #054f77 !important;
    text-align: center;
    cursor: pointer;
    &:hover {
      background: linear-gradient(
          0deg,
          rgba(5, 79, 119, 0.05),
          rgba(5, 79, 119, 0.05)
        ),
        #ffffff;
    }
    &:active {
      background: linear-gradient(
          0deg,
          rgba(5, 79, 119, 0.1),
          rgba(5, 79, 119, 0.1)
        ),
        #ffffff;
    }
  }
  &__hint {
    text-align: center;
    font-size: 16px;
    line-height: 180%;
    color: rgba(0, 0, 0, 0.5);
    margin: 0 0 24px 0;
    p + p {
      margin-top: 8px;
    }
  }
}
</style>
