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
  padding: 48px 20px;
  background-color: #eeeeee;
  &__item {
    & + & {
      margin: 24px 0 0 0;
    }
  }
}

.item {
  display: flex;
  flex-direction: column-reverse;
  &__title {
    margin: 12px 0 0 0;
    font-size: 18px;
    line-height: 1.5;
    color: rgba(0, 0, 0, 0.87);
  }
}
</style>
