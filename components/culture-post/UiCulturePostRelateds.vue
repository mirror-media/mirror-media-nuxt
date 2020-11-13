<template>
  <div class="relateds">
    <h2>延伸閱讀</h2>

    <div class="relateds__items">
      <div v-for="item in items" :key="item.slug" class="related">
        <a
          :href="`/story/${item.slug}`"
          class="related__image"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img :src="gainImgSrc(item.heroImage)" alt="" />
        </a>

        <a
          :href="`/story/${item.slug}`"
          class="related__title"
          target="_blank"
          rel="noopener noreferrer"
          >{{ item.title }}</a
        >
      </div>
    </div>
  </div>
</template>

<script>
import { SITE_OG_IMG } from '~/constants/index.js'

export default {
  name: 'UiCulturePostRelateds',

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
    gainImgSrc(id) {
      const item = this.imgs.find((item) => item.id === id) || {}

      return item.image?.resizedTargets?.mobile?.url || SITE_OG_IMG
    },
  },
}
</script>

<style lang="scss" scoped>
.relateds {
  width: 300px;
  padding-bottom: 63px;
  margin-left: auto;
  margin-right: auto;
  @include media-breakpoint-up(md) {
    width: 700px;
  }

  h2 {
    width: 266px;
    margin-left: auto;
    margin-right: auto;
    font-family: source-han-serif-tc, 'Songti TC', serif;
    font-size: 28px;
    font-weight: 900;
    @include media-breakpoint-up(md) {
      width: 634px;
    }
  }

  a {
    display: block;
  }

  &__items {
    margin-top: 40px;
    @include media-breakpoint-up(md) {
      display: flex;
      flex-wrap: wrap;
      margin-top: 20px;
    }
  }
}

.related {
  display: flex;
  @include media-breakpoint-up(md) {
    display: block;
    width: calc((100% - 60px) / 3);
    margin-top: 20px;
    margin-left: 10px;
    margin-right: 10px;
  }

  + .related {
    margin-top: 20px;
  }

  &__image {
    position: relative;
    width: 116px;
    padding-top: calc(116px * 0.6666);
    @include media-breakpoint-up(md) {
      width: 100%;
      padding-top: 66.66%;
    }

    img {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__title {
    flex-grow: 1;
    flex-basis: 0%;
    margin-left: 10px;
    font-family: source-han-serif-tc, 'Songti TC', serif;
    font-size: 15px;
    font-weight: 900;
    line-height: 1.73;
    @include media-breakpoint-up(md) {
      margin-top: 10px;
    }
  }
}
</style>
