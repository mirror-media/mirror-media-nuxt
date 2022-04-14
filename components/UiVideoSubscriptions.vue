<template>
  <section
    class="video-subscriptions"
    :class="{ isPremiumMember: isPremiumMember }"
  >
    <div class="scroll-container">
      <UiYoutubeSubscribe
        v-for="channel in CHANNELS"
        :key="`channel-${channel.id}`"
        :channelId="channel.id"
        :channelName="channel.name"
        :channelTitle="channel.title"
        class="video-subscriptions__channel"
      />
    </div>
  </section>
</template>

<script>
import UiYoutubeSubscribe from './UiYoutubeSubscribe.vue'

const CHANNELS = [
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

  /*
   * {
   *   title: '鏡發財',
   *   id: 'UCYkldEK001GxR884OZMFnRw',
   *   name: 'money',
   * },
   */
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
  },
  data() {
    return {
      CHANNELS,
    }
  },
  computed: {
    isPremiumMember() {
      return this.$store?.getters?.['membership-subscribe/isPremiumMember']
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
    justify-content: space-between;
    max-width: 1024px;
    margin: 0 auto;
    @include media-breakpoint-up(xl) {
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

.isPremiumMember {
  background: #f5f5f5;
}
</style>
