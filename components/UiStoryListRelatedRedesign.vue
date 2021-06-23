<template>
  <ol class="story-list-related">
    <template v-if="doesHaveAnyItems">
      <li
        v-for="item in items"
        :key="item.slug"
        class="story-list-related__item-wrapper item-wrapper"
      >
        <a
          class="item-wrapper__item item"
          :href="`/story/${item.slug}`"
          target="_blank"
          rel="noopener noreferrer"
          @click="$emit('sendGa')"
        >
          <img
            class="item__img img"
            :src="getImgById(images, item.heroImage)"
            alt="related-list-item-img"
          />
          <p class="item__title title">{{ item.title }}</p>
        </a>
      </li>
    </template>

    <slot name="ads"></slot>
  </ol>
</template>

<script>
import { getImgById } from '~/utils/img.js'

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
    getImgById,
  },
}
</script>

<style lang="scss" scoped>
.story-list-related {
  display: flex;
  flex-direction: column;
  @include media-breakpoint-up(md) {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  &__item-wrapper {
    @include media-breakpoint-up(md) {
      margin: 16px 0 0 0;
    }
    & + & {
      margin: 12px 0 0 0;
      @include media-breakpoint-up(md) {
        margin: 16px 0 0 0;
      }
    }
    @include media-breakpoint-up(md) {
      width: calc((100% - 25px) / 2);
    }
  }
}

.item {
  display: flex;
  &__title {
    margin: 0 0 0 16px;
    font-size: 16px;
    line-height: 150%;
    color: #4a4a4a;
  }
}

.img {
  width: 90px;
  height: 90px;
  object-fit: cover;
  @include media-breakpoint-up(xl) {
    width: 135px;
  }
}
</style>
