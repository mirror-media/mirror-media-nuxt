<template>
  <section v-if="hasItems" :class="category.name" class="video-category">
    <h1 class="video-category__heading">
      <a
        :href="`/video_category/${category.name}`"
        target="_blank"
        rel="noopener noreferrer"
        v-text="category.title"
      />
    </h1>
    <div class="video-category__first">
      <UiLinkedItemWithTitle
        :title="theFirstItem.title"
        :href="`/video/${theFirstItem.videoId}`"
        :imgSrc="theFirstItem.thumbnails"
        @click="handleClick"
      />
      <a
        :href="`/video_category/${category.name}`"
        class="video-category__category-link"
        target="_blank"
        rel="noopener noreferrer"
        @click="handleClick('more')"
      >
        看更多
      </a>
    </div>
    <div class="video-category__remaining">
      <UiLinkedItemWithTitle
        v-for="item in remainingItems"
        :key="`category-${category.name}-${item.videoId}`"
        :title="item.title"
        :href="`/video/${item.videoId}`"
        :imgSrc="item.thumbnails"
        textPositionInMdViewport="right"
        class="video-category__remaining-item"
        @click="handleClick"
      />
    </div>
  </section>
</template>

<script>
import UiLinkedItemWithTitle from './UiLinkedItemWithTitle.vue'

export default {
  naem: 'UiVideoCategory',
  components: {
    UiLinkedItemWithTitle,
  },
  props: {
    category: {
      type: Object,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
  },
  computed: {
    hasItems() {
      return this.items.length > 0
    },
    remainingItems() {
      return this.items.slice(1)
    },
    theFirstItem() {
      return this.items[0]
    },
  },
  methods: {
    handleClick(eventLabel = 'category_video') {
      this.$emit('sendGa', {
        eventCategory: 'listing',
        eventAction: 'click',
        eventLabel,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.video-category {
  position: relative;
  padding: 29px 20px 71px;
  @include media-breakpoint-up(md) {
    position: static;
    display: flex;
    flex-wrap: wrap;
  }
  @include media-breakpoint-up(xl) {
    padding: 0;
  }
  &__heading {
    display: inline;
    color: #4a4a4a;
    font-size: 24px;
    font-weight: 600;
    &::before {
      content: '';
      display: inline-block;
      width: 10px;
      height: 1em;
      margin-right: 10px;
      background-color: #000;
      transform: translateY(4px);
      @include media-breakpoint-up(md) {
        content: none;
      }
    }
    @include media-breakpoint-up(md) {
      width: 100%;
    }
    + * {
      margin-top: 5px;
    }
  }
  &__first {
    @include media-breakpoint-up(md) {
      position: relative;
      width: 350px;
      margin-top: 10px;
      background-color: #000;
    }
    + * {
      margin-top: 20px;
    }
    &::v-deep {
      .linked-item__title {
        @include media-breakpoint-up(md) {
          padding: 5px 18px 5px 19px;
          margin-bottom: 50px;
          color: #fff;
          line-height: 1.6;
        }
        @include media-breakpoint-up(xl) {
          font-size: 20px;
          font-weight: 500;
        }
      }
    }
  }
  &__category-link {
    position: absolute;
    right: 20px;
    bottom: 29px;
    color: #356c9b;
    font-size: 16px;
    @include media-breakpoint-up(md) {
      right: 18px;
      bottom: 15px;
      color: #fff;
    }
    &::after {
      content: '';
      display: inline-block;
      width: 0;
      height: 0;
      margin-left: 5px;
      border-style: solid;
      border-width: 6px 0 6px 12px;
      border-color: transparent transparent transparent #356c9b;
      @include media-breakpoint-up(md) {
        right: 18px;
        bottom: 15px;
        border-color: transparent transparent transparent #fff;
      }
    }
  }
  &__remaining {
    @include media-breakpoint-up(md) {
      flex: 1;
      margin: 10px 0 0 30px;
    }
  }
  &__remaining-item {
    + .video-category__remaining-item {
      margin-top: 20px;
      @include media-breakpoint-up(md) {
        margin-top: 10px;
      }
    }
  }
}

.video-category {
  // 鏡封面
  &.video_coverstory {
    .video-category__heading {
      &::before {
        background-color: #30bac8;
      }
    }
    @include media-breakpoint-up(md) {
      .video-category__heading {
        color: #30bac8;
      }
      .video-category__first {
        background-color: #30bac8;
      }
    }
  }
  // 鏡娛樂
  &.video_entertainment {
    .video-category__heading {
      &::before {
        background-color: #bf3385;
      }
    }
    @include media-breakpoint-up(md) {
      .video-category__heading {
        color: #bf3385;
      }
      .video-category__first {
        background-color: #bf3385;
      }
    }
  }
  // 鏡社會
  &.video_society {
    .video-category__heading {
      &::before {
        background-color: #8b572a;
      }
    }
    @include media-breakpoint-up(md) {
      .video-category__heading {
        color: #8b572a;
      }
      .video-category__first {
        background-color: #8b572a;
      }
    }
  }
  // 鏡調查
  &.video_investigation {
    .video-category__heading {
      &::before {
        background-color: #417505;
      }
    }
    @include media-breakpoint-up(md) {
      .video-category__heading {
        color: #417505;
      }
      .video-category__first {
        background-color: #417505;
      }
    }
  }
  // 鏡人物
  &.video_people {
    .video-category__heading {
      &::before {
        background-color: #4a90e2;
      }
    }
    @include media-breakpoint-up(md) {
      .video-category__heading {
        color: #4a90e2;
      }
      .video-category__first {
        background-color: #4a90e2;
      }
    }
  }
  // 鏡財經
  &.video_finance {
    .video-category__heading {
      &::before {
        background-color: #8b222c;
      }
    }
    @include media-breakpoint-up(md) {
      .video-category__heading {
        color: #8b222c;
      }
      .video-category__first {
        background-color: #8b222c;
      }
    }
  }
  // 鏡食旅
  &.video_foodtravel {
    .video-category__heading {
      &::before {
        background-color: #f1a356;
      }
    }
    @include media-breakpoint-up(md) {
      .video-category__heading {
        color: #f1a356;
      }
      .video-category__first {
        background-color: #f1a356;
      }
    }
  }
  // 娛樂透視
  &.video_ent_perspective {
    .video-category__heading {
      &::before {
        background-color: #30bac8;
      }
    }
    @include media-breakpoint-up(md) {
      .video-category__heading {
        color: #30bac8;
      }
      .video-category__first {
        background-color: #30bac8;
      }
    }
  }
  // 鏡錶誌
  &.video_carandwatch {
    .video-category__heading {
      &::before {
        background-color: #969696;
      }
    }
    @include media-breakpoint-up(md) {
      .video-category__heading {
        color: #969696;
      }
      .video-category__first {
        background-color: #969696;
      }
    }
  }
}
</style>
