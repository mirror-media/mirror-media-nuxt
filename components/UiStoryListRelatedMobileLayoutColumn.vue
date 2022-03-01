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
          <img :src="getImgById(images, item.heroImage)" alt="" />
        </a>
      </div>
    </template>

    <slot name="ads"></slot>
  </div>
</template>

<script>
import { getImgById } from '~/utils/img.js'

export default {
  name: 'UiStoryListRelatedMobileLayoutColumn',
  props: {
    images: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    doesHaveAnyItems() {
      return this.items.length > 0
    },
  },

  methods: {
    getImgById,
  },
}
</script>

<style lang="scss" scoped>
.story-list-related {
  padding: 48px 20px;
  background-color: #eeeeee;
  @include media-breakpoint-up(md) {
    background-color: transparent;
  }

  &__item {
    & + & {
      margin: 24px 0 0 0;
    }
  }
}

.item {
  display: flex;
  flex-direction: column-reverse;
  @include media-breakpoint-up(md) {
    flex-direction: row;
    justify-content: space-between;
    background-color: #eeeeee;
    border-left: 7.72px solid #808080;
  }

  &__title {
    margin: 12px 0 0 0;
    font-size: 18px;
    line-height: 1.5;
    color: rgba(0, 0, 0, 0.87);
    @include media-breakpoint-up(md) {
      margin: 0 0 0 18px;
      display: flex;
      align-items: center;
      line-height: 1.3;
      color: #808080;
      a {
        word-wrap: break-word;
        -webkit-line-clamp: 2;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
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
      min-width: 86.91px;
      width: 86.91px;
      min-height: 90px;
      height: 90px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    @include media-breakpoint-up(xl) {
      min-width: 135px;
      width: 135px;
    }
  }
}
</style>
