<template>
  <section v-if="hasItmes" class="video-latest">
    <div class="video-latest__first">
      <UIYoutubeIframe :videoId="theFirstItem.videoId" />
      <a
        class="video-latest__first-title"
        href="http://"
        target="_blank"
        rel="noopener noreferrer"
        v-text="theFirstItem.title"
      />
    </div>
    <h1 class="video-latest__heading">最新影片</h1>
    <div class="video-latest__remaining">
      <UILinkedItemWithTitle
        v-for="item in remainingItems"
        :key="`latest-${item.videoId}`"
        :title="item.title"
        :href="`/video/${item.videoId}`"
        :imgSrc="item.thumbnails"
        textPositionInMdViewport="right"
        class="video-latest__item"
      />
    </div>
  </section>
</template>

<script>
import UILinkedItemWithTitle from './UILinkedItemWithTitle.vue'
import UIYoutubeIframe from './UIYoutubeIframe.vue'

export default {
  name: 'UIVideoLatest',
  components: {
    UILinkedItemWithTitle,
    UIYoutubeIframe,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  computed: {
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
}
</script>

<style lang="scss" scoped>
.video-latest {
  @include media-breakpoint-up(xl) {
    display: flex;
    flex-wrap: wrap;
  }
  &__first {
    @include media-breakpoint-up(xl) {
      order: 1;
      width: 580px;
      margin-top: 20px;
    }
    & + * {
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

  &__heading,
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

  &__heading {
    color: #4a4a4a;
    font-size: 20px;
    font-weight: 600;
    @include media-breakpoint-up(xl) {
      order: 0;
    }
    & + * {
      margin-top: 10px;
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
    & + .video-latest__item {
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
}
</style>
