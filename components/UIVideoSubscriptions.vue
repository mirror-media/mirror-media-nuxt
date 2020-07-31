<template>
  <section class="video-subscriptions">
    <div class="scroll-container">
      <UIYoutubeSubscribe
        v-for="channel in CHANNELS"
        :key="`channel-${channel}`"
        :channelId="channel"
        class="video-subscriptions__channel"
      />
    </div>
  </section>
</template>

<script>
import UIYoutubeSubscribe from './UIYoutubeSubscribe.vue'

const CHANNELS = [
  'UCYkldEK001GxR884OZMFnRw', // 鏡週刊
  'UCccoVnb8YmHzArr7yrX7bTA', // 鏡人物
  'UCSGNZVECzarsXTxPsNS9Zow', // 鏡娛樂
  'UC4LjkybVKXCDlneVXlKAbmw', // 鏡電視
  'UCbeskkrp36Virbj6lcxWxJA', // Mirror Watch TV鏡錶誌
  'UCglE1_DI0TDSY70WfeoPSOQ', // 美食旅遊
]

export default {
  name: 'UIVideoSubscriptions',
  components: {
    UIYoutubeSubscribe,
  },
  data() {
    return {
      CHANNELS,
    }
  },
}
</script>

<style lang="scss" scoped>
.video-subscriptions {
  padding: 20px 0 0;
  background-color: #ffffff;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  @include media-breakpoint-up(xl) {
    background-color: #ececec;
    box-shadow: none;
  }
  .scroll-container {
    display: flex;
    padding: 0 0 20px;
    flex-wrap: nowrap;
    overflow-x: auto;
    @include media-breakpoint-up(xl) {
      justify-content: center;
      overflow: hidden;
    }
  }
  &__channel {
    &:first-child {
      margin-left: 20px;
      @include media-breakpoint-up(xl) {
        margin-left: 0;
      }
    }
    &:last-child {
      padding-right: 20px;
      @include media-breakpoint-up(xl) {
        padding: 0;
      }
    }
    + .video-subscriptions__channel {
      margin: 0 0 0 30px;
      @include media-breakpoint-up(xl) {
        margin: 0 0 0 55px;
      }
    }
  }
}
</style>
