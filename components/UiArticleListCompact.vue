<template>
  <div class="story-list-related">
    <template v-if="doesHaveAnyItems">
      <div
        v-for="item in items"
        :key="item.slug"
        class="story-list-related__item item"
      >
        <div class="item__title">
          <a
            :href="`/story/${item.slug}`"
            target="_blank"
            rel="noopener noreferrer"
            :style="{
              color: titleColor,
            }"
            @click="$emit('sendGa')"
            v-text="item.title"
          />
        </div>
        <a
          :href="`/story/${item.slug}`"
          class="item__image"
          target="_blank"
          rel="noopener noreferrer"
          @click="$emit('sendGa')"
        >
          <img :src="item.imgSrc" alt="" />
        </a>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'UiArticleListCompact',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    titleColor: {
      type: String,
      default: '#888888',
    },
  },

  computed: {
    doesHaveAnyItems() {
      return this.items.length > 0
    },
  },
}
</script>

<style lang="scss" scoped>
.story-list-related {
  padding: 48px 20px;
  @include media-breakpoint-up(xl) {
    display: flex;
    flex-wrap: wrap;
    margin: -24px 0 0 -24px;
  }

  &__item {
    @include media-breakpoint-up(xl) {
      margin: 24px 0 0 24px;
    }

    & + & {
      margin: 24px 0 0 0;
      @include media-breakpoint-up(md) {
        margin: 36px 0 0 0;
      }
      @include media-breakpoint-up(xl) {
        margin: 24px 0 0 24px;
      }
    }
  }
}

.item {
  display: flex;
  flex-direction: column-reverse;
  @include media-breakpoint-up(md) {
    flex-direction: row-reverse;
    width: 100%;
  }
  @include media-breakpoint-up(xl) {
    flex-direction: column-reverse;
    width: 276px;
  }

  &__title {
    margin: 12px 0 0 0;
    font-size: 18px;
    line-height: 1.5;
    color: #888888;
    @include media-breakpoint-up(md) {
      margin: 0 0 0 28px;
      display: flex;
      font-size: 20px;
      line-height: 32px;
      color: #808080;
      width: 100%;
      a {
        word-wrap: break-word;
        -webkit-line-clamp: 2;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
    @include media-breakpoint-up(xl) {
      margin: 16px 0 0 0;
      font-size: 18px;
      line-height: 1.5;
    }
  }

  &__image {
    height: 0;
    padding-top: 66.66%;
    position: relative;
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    @include media-breakpoint-up(md) {
      padding-top: 0;
      min-width: 266px;
      width: 266px;
      min-height: 177px;
      height: 177px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    @include media-breakpoint-up(xl) {
      min-width: 276px;
      width: 276px;
      min-height: 184px;
      height: 184px;
    }
  }
}
</style>
