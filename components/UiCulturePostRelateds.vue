<template>
  <div class="relateds">
    <h2>延伸閱讀</h2>
    <div class="relateds__items">
      <div v-for="item in items" :key="item.slug" class="related">
        <a
          :href="`/culture-post/${item.slug}`"
          class="related__image"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img v-lazy="getImageUrl(item)" :alt="item.title" />
        </a>
        <a
          :href="`/culture-post/${item.slug}`"
          class="related__title"
          target="_blank"
          rel="noopener noreferrer"
          v-text="item.title"
        />
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
      required: true,
    },
  },
  methods: {
    getImageUrl(item) {
      return item.heroImage?.image?.resizedTargets?.mobile?.url ?? SITE_OG_IMG
    },
  },
}
</script>

<style lang="scss" scoped>
.relateds {
  width: 300px;
  margin: 0 auto;
  padding-bottom: 63px;
  @include media-breakpoint-up(md) {
    width: 700px;
  }
  h2 {
    width: 266px;
    margin-left: auto;
    margin-right: auto;
    color: rgba(0, 0, 0, 0.87);
    font-size: 28px;
    font-weight: 900;
    font-family: source-han-serif-tc, Songti, 'Microsoft YaHei', serif;
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
    margin: 20px 10px 0;
  }
  & + .related {
    margin-top: 20px;
  }
  &__image {
    position: relative;
    display: block;
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
      object-position: center center;
    }
  }
  &__title {
    flex: 1;
    margin-left: 10px;
    color: rgba(0, 0, 0, 0.87);
    font-size: 15px;
    font-weight: 900;
    font-family: source-han-serif-tc, Songti, 'Microsoft YaHei', serif;
    line-height: 1.73;
    @include media-breakpoint-up(md) {
      margin: 10px 0 0;
    }
  }
}
</style>
