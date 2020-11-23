<template>
  <div class="story-list-related">
    <template v-if="doesHaveAnyItems">
      <div v-for="item in items" :key="item.slug" class="item">
        <div class="item__title">
          <a
            :href="`/story/${item.slug}`"
            target="_blank"
            rel="noopener noreferrer"
            v-text="item.title"
          />
        </div>
        <a
          :href="`/story/${item.slug}`"
          class="item__image"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img :src="gainImgSrcById(images, item.heroImage)" alt="" />
        </a>
      </div>
    </template>

    <slot name="ads"></slot>
  </div>
</template>

<script>
import { gainImgSrcById } from '~/utils/img.js'

export default {
  name: 'UiStoryListRelated',
  props: {
    images: {
      type: Array,
      default: () => [],
      required: true,
    },
    items: {
      type: Array,
      default: () => [],
      required: true,
    },
  },

  computed: {
    doesHaveAnyItems() {
      return this.items.length > 0
    },
  },

  methods: {
    gainImgSrcById,
  },
}
</script>

<style lang="scss" scoped>
.story-list-related {
  display: flex;
  flex-direction: column;

  .item {
    display: flex;
    color: #808080;
    background-color: #eee;

    &::before {
      content: '';
      display: block;
      width: 10px;
      flex-shrink: 0;
      background-color: #808080;
    }

    + .item {
      margin-top: 16px;
    }

    &__title {
      display: flex;
      align-items: center;
      flex-grow: 1;
      padding: 16px;
      @include media-breakpoint-up(md) {
        padding-left: 32px;
        padding-right: 32px;
      }

      a {
        font-size: 18px;
        line-height: 1.3;
        display: block;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        // 2.6em = 1em * 1.3 * 2
        max-height: 2.6em;
      }
    }

    &__image {
      position: relative;
      flex-shrink: 0;
      width: 33%;
      padding-top: calc(33% * 0.75);
      @include media-breakpoint-up(md) {
        width: 25%;
        padding-top: calc(25% * 0.75);
      }
      @include media-breakpoint-up(lg) {
        width: 20%;
        padding-top: calc(20% * 0.75);
      }

      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}
</style>
