<template>
  <section v-if="hasItmes" class="video-iframe-items">
    <div class="video-iframe-items__first">
      <UiYoutubeIframe :videoId="theFirstItem.videoId" />
      <a
        class="video-iframe-items__first-title"
        :href="`/video/${theFirstItem.videoId}`"
        target="_blank"
        rel="noopener noreferrer"
        @click="handleClick"
        v-text="theFirstItem.title"
      />
    </div>
    <client-only>
      <GptAd
        class="video-iframe-items__ad"
        :adUnit="ad.adUnit"
        :adSize="ad.adSize"
      />
    </client-only>
    <slot name="heading" />
    <div class="video-iframe-items__remaining">
      <UiLinkedItemWithTitle
        v-for="item in remainingItems"
        :key="`item-${item.videoId}`"
        :title="item.title"
        :href="`/video/${item.videoId}`"
        :imgSrc="item.thumbnails"
        :textPositionInMdViewport="textPositionInMdViewport"
        class="video-iframe-items__item"
        @click="handleClick"
      />
    </div>
  </section>
</template>

<script>
import UiLinkedItemWithTitle from './UiLinkedItemWithTitle.vue'
import UiYoutubeIframe from './UiYoutubeIframe.vue'
import gptAdUnits from '~/constants/gpt-ad-units.js'

export default {
  name: 'UiVideoIframeWithItems',
  components: {
    UiLinkedItemWithTitle,
    UiYoutubeIframe,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
    textPositionInMdViewport: {
      type: String,
      default: 'bottom',
    },
  },
  data() {
    return {
      videoAdUnits: gptAdUnits.videohub ?? {},
    }
  },
  computed: {
    ad() {
      return this.videoAdUnits[`${this.adDevice}_HD`] ?? {}
    },
    adDevice() {
      return this.$ua.isFromPc() ? 'PC' : 'MB'
    },
    hasItmes() {
      return this.items.length > 0
    },
    remainingItems() {
      return this.items.slice(1, 5)
    },
    theFirstItem() {
      return this.items[0]
    },
  },
  methods: {
    handleClick() {
      this.$emit('sendGa', {
        eventCategory: 'listing',
        eventAction: 'click',
        eventLabel: 'latest_video',
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.video-iframe-items {
  @include media-breakpoint-up(xl) {
    display: flex;
    flex-wrap: wrap;
  }

  > h1,
  &__remaining {
    width: calc(100% - 40px);
    margin-left: auto;
    margin-right: auto;
    @include media-breakpoint-up(md) {
      width: 60%;
    }
    @include media-breakpoint-up(xl) {
      width: 100%;
    }
  }

  > h1 {
    color: #4a4a4a;
    font-size: 20px;
    font-weight: 600;
    @include media-breakpoint-up(xl) {
      order: 0;
    }
    + * {
      margin-top: 10px;
      @include media-breakpoint-up(xl) {
        margin-top: 20px;
      }
    }
  }
  &__first {
    @include media-breakpoint-up(xl) {
      order: 1;
      width: 580px;
      margin-top: 20px;
    }
    + * {
      margin-top: 20px;
    }
    &-title {
      display: none;
      @include media-breakpoint-up(xl) {
        display: block;
        margin-top: 10px;
        color: #4a4a4a;
        font-size: 20px;
        font-weight: 500;
        line-height: 1.6;
      }
    }
  }

  &__remaining {
    padding-bottom: 21px;
    @include media-breakpoint-up(xl) {
      flex: 1;
      order: 1;
      width: auto;
      margin: 20px 0 0 40px;
      padding: 0;
    }
  }

  &__item {
    + .video-iframe-items__item {
      margin-top: 20px;
    }
    &.align-right {
      &::v-deep .linked-item__title {
        @include media-breakpoint-up(md) {
          margin-left: 20px;
        }
      }
    }
  }

  &__ad {
    margin: 20px auto;
    @include media-breakpoint-up(xl) {
      order: 0;
    }
  }
}
</style>
