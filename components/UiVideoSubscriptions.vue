<template>
  <section class="video-subscriptions" :class="{ isPremium: isPremium }">
    <div v-if="isPremium" class="scroll-container">
      <UiYoutubeSubscribeForPremium
        v-for="channel in CHANNELS_FOR_PREMIUM"
        :key="`channel-${channel.id}`"
        :channelId="channel.id"
        :channelName="channel.name"
        :channelTitle="channel.title"
        class="video-subscriptions__channel"
      />
    </div>
    <div v-else class="scroll-container">
      <UiYoutubeSubscribe
        v-for="channel in CHANNELS"
        :key="`channel-${channel}`"
        :channelId="channel"
        class="video-subscriptions__channel"
      />
    </div>
  </section>
</template>

<script>
import UiYoutubeSubscribe from './UiYoutubeSubscribe.vue'
import UiYoutubeSubscribeForPremium from './UiYoutubeSubscribeForPremium.vue'
import { ENV } from '~/configs/config'
const CHANNELS = [
  'UCYkldEK001GxR884OZMFnRw', // 鏡週刊
  'UCccoVnb8YmHzArr7yrX7bTA', // 鏡人物
  'UCSGNZVECzarsXTxPsNS9Zow', // 鏡娛樂
  'UC4LjkybVKXCDlneVXlKAbmw', // 鏡電視
  'UCglE1_DI0TDSY70WfeoPSOQ', // 美食旅遊
  'UCbeskkrp36Virbj6lcxWxJA', // Mirror Watch TV鏡錶誌
]

const CHANNELS_FOR_PREMIUM = [
  {
    title: '鏡週刊',
    id: 'UCYkldEK001GxR884OZMFnRw',
    name: 'media',
  },
  {
    title: '鏡人物',
    id: 'UCccoVnb8YmHzArr7yrX7bTA',
    name: 'people',
  },
  {
    title: '鏡娛樂',
    id: 'UCSGNZVECzarsXTxPsNS9Zow',
    name: 'fun',
  },
  // {
  //   title: '鏡發財',
  //   id: 'UCYkldEK001GxR884OZMFnRw',
  //   name: 'money',
  // },
  {
    title: '鏡食旅',
    id: 'UCglE1_DI0TDSY70WfeoPSOQ',
    name: 'food',
  },
  {
    title: '鏡錶誌',
    id: 'UCbeskkrp36Virbj6lcxWxJA',
    name: 'watch',
  },
]

export default {
  title: 'UiVideoSubscriptions',
  components: {
    UiYoutubeSubscribe,
    UiYoutubeSubscribeForPremium,
  },
  data() {
    return {
      CHANNELS,
      CHANNELS_FOR_PREMIUM,
    }
  },
  computed: {
    isPremium() {
      if (ENV === 'staging' || ENV === 'prod') return false
      const memberType = this.$store?.state['membership-subscribe']?.basicInfo
        .type
      return (
        memberType === 'subscribe_monthly' || memberType === 'subscribe_yearly'
      )
    },
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

.isPremium {
  background: #f5f5f5;
}
</style>
