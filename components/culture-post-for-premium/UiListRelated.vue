<template>
  <div class="list-related">
    <UiH4 v-text="'延伸閱讀'" />

    <div class="list-related__list list">
      <div v-for="item in items" :key="item.slug" class="list__item item">
        <a
          :href="`/story/${item.slug}`"
          class="item__img"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img :src="getImgById(imgs, item.heroImage)" alt="" />
        </a>

        <a
          :href="`/story/${item.slug}`"
          class="item__title"
          target="_blank"
          rel="noopener noreferrer"
          >{{ item.title }}</a
        >
      </div>
    </div>
  </div>
</template>

<script>
import UiH4 from './UiH4.vue'
import { getImgById } from '~/utils/img.js'

export default {
  name: 'UiListRelated',

  components: {
    UiH4,
  },

  props: {
    items: {
      type: Array,
      default: () => [],
      required: true,
    },
    imgs: {
      type: Array,
      default: () => [],
      required: true,
    },
  },

  methods: {
    getImgById,
  },
}
</script>

<style lang="scss" scoped>
.list-related {
  &__list {
    margin: 16px 0 0 0;
    @include media-breakpoint-up(md) {
      margin: 20px 0 0 0;
    }
  }
}

.list {
  @include media-breakpoint-up(md) {
    display: flex;
    flex-wrap: wrap;
    margin: -8px 0 0 -24px;
  }

  &__item {
    @include media-breakpoint-up(md) {
      margin: 24px 0 0 24px;
    }
    & + & {
      margin: 12px 0 0 0;
      @include media-breakpoint-up(md) {
        margin: 24px 0 0 24px;
      }
    }
  }
}

.item {
  display: flex;
  @include media-breakpoint-up(md) {
    width: calc(50% - 24px);
  }

  &__img {
    display: block;
    width: 90px;
    height: 90px;
    min-width: 90px;
    min-height: 90px;
    @include media-breakpoint-up(md) {
      width: 120px;
      height: 80px;
      min-width: 120px;
      min-height: 80px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__title {
    margin: 0 0 0 16px;
    font-family: source-han-serif-tc, 'Songti TC', serif;
    font-size: 16px;
    font-weight: 500;
    line-height: 150%;
  }
}
</style>
