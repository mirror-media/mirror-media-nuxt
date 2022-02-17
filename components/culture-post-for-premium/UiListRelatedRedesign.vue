<template>
  <div class="list-related">
    <UiH3>延伸閱讀</UiH3>

    <div class="list-related__list list">
      <div
        v-for="item in items"
        :key="item.slug"
        class="list__item item"
        data-user-behavior-description="read-around"
      >
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
import UiH3 from './UiH3.vue'
import { getImgById } from '~/utils/img.js'

export default {
  name: 'UiListRelatedRedsign',

  components: {
    UiH3,
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
  background-color: inherit;
  width: 282px;
  margin: 0 auto;
  @include media-breakpoint-up(md) {
    width: 100%;
  }
  @include media-breakpoint-up(xl) {
    max-width: 1176px;
  }
  @include media-breakpoint-up(xxl) {
    max-width: 1200px;
  }
  &__list {
    @include media-breakpoint-up(md) {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }
    @include media-breakpoint-up(xl) {
      justify-content: flex-start;
    }
  }
}

.list {
  &__item {
    margin: 16px auto 24px;
    @include media-breakpoint-up(md) {
      margin: 24px 0 24px;
    }

    & + & {
      margin: 24px 0 24px;
    }
    &:not(:nth-child(4n)) {
      @include media-breakpoint-up(xl) {
        margin-right: 24px;
      }
    }
  }
}

.item {
  $item-width: (
    default: 280px,
    md: 292px,
    xl: 276px,
    xxl: 282px,
  );
  @function change-width($key) {
    @return map-get($item-width, $key);
  }

  width: change-width(default);

  @include media-breakpoint-up(md) {
    width: change-width(md);
  }
  @include media-breakpoint-up(xl) {
    width: change-width(xl);
  }
  @include media-breakpoint-up(xxl) {
    width: change-width(xxl);
  }
  display: flex;
  flex-direction: column;

  &__img {
    @function change-height($key) {
      @return change-width($key) / 3 * 2;
    }
    display: block;
    align-self: center;
    width: change-width(default);
    height: change-height(default);
    @include media-breakpoint-up(md) {
      width: change-width(md);
      height: change-height(md);
    }
    @include media-breakpoint-up(xl) {
      width: change-width(xl);
      height: change-height(xl);
    }
    @include media-breakpoint-up(xxl) {
      width: change-width(xxl);
      height: change-height(xxl);
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__title {
    font-family: source-han-serif-tc, 'Songti TC', serif;
    font-size: 18px;
    font-weight: 500;
    line-height: 150%;
    margin: 12px 0 0 0;
    @include media-breakpoint-up(md) {
      margin: 16px 0 0 0;
    }
  }
}
</style>
