<template>
  <section v-if="hasItmes" class="video-popular">
    <h1 class="video-popular__heading">熱門影片</h1>
    <div class="scroll-container">
      <UILinkedItemWithTitle
        v-for="item in items"
        :key="`popular-${item.videoId}`"
        :title="item.title"
        :href="`/video/${item.videoId}`"
        :imgSrc="item.thumbnails"
        :limitLines="2"
        class="video-popular__item"
      />
    </div>
  </section>
</template>

<script>
import UILinkedItemWithTitle from './UILinkedItemWithTitle.vue'

export default {
  name: 'UIVideoPopular',
  components: {
    UILinkedItemWithTitle,
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
  },
}
</script>

<style lang="scss" scoped>
.video-popular {
  padding: 30px 0 32px 0;
  border-top: 1px solid #979797;
  @include media-breakpoint-up(xl) {
    width: 239px;
    padding: 0 39px 0 0;
    border-top: none;
    border-right: 1px solid #979797;
  }
  .scroll-container {
    display: flex;
    flex-wrap: nowrap;
    margin-top: 10px;
    padding: 0 0 20px 0;
    overflow-x: auto;
    @include media-breakpoint-up(xl) {
      flex-direction: column;
      padding: 0;
      overflow: hidden;
    }
  }
  &__heading {
    padding: 0 0 0 20px;
    color: #4a4a4a;
    font-size: 20px;
    font-weight: 600;
    @include media-breakpoint-up(xl) {
      padding: 0;
      font-size: 24px;
    }
  }
  &__item {
    flex: 0 0 150px;
    @include media-breakpoint-up(xl) {
      width: 200px;
    }
    &:first-child {
      margin-left: 20px;
      @include media-breakpoint-up(xl) {
        margin: 0;
      }
    }
    &:last-child {
      padding-right: 20px;
      @include media-breakpoint-up(xl) {
        padding: 0;
      }
    }
    & + .video-popular__item {
      margin: 0 0 0 30px;
      @include media-breakpoint-up(xl) {
        margin: 21px 0 0;
      }
    }
    &::v-deep .linked-item__title {
      display: inline-block;
      margin-top: 10px;
      @include media-breakpoint-up(xl) {
        margin-top: 5px;
      }
    }
  }
}
</style>
