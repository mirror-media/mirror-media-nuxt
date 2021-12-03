<template>
  <div class="article-list-aside">
    <div v-if="heading" class="heading">{{ heading }}</div>

    <div class="list">
      <div
        v-for="item in items"
        :key="item.slug"
        class="item"
        :class="item.sectionName"
      >
        <a
          :href="item.href"
          class="item__image"
          target="_blank"
          rel="noopener noreferrer"
          @click="$emit('sendGa')"
        >
          <img :src="item.imgSrc" alt="" />
        </a>

        <div class="item__title-wrapper">
          <div class="item__label">{{ item.label }}</div>
          <a
            :href="item.href"
            class="item__title"
            target="_blank"
            rel="noopener noreferrer"
            @click="$emit('sendGa')"
            >{{ item.title }}</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UiArticleListAside',
  props: {
    heading: {
      type: String,
      default: undefined,
    },
    items: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
}
</script>

<style lang="scss" scoped>
.article-list-aside {
  color: #34495e;

  .heading {
    font-size: 24px;
    font-weight: 700;
    @include media-breakpoint-up(xl) {
      padding: 6px 18px;
      color: #fff;
      font-size: 18px;
      background-color: #0c5a80;
    }
    + * {
      margin-top: 20px;
      @include media-breakpoint-up(xl) {
        margin-top: 0;
      }
    }
  }

  .list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: flex-start;
    @include media-breakpoint-up(xl) {
      padding: 18px;
      border-bottom: 1px solid #dedede;
      border-right: 1px solid #dedede;
      border-left: 1px solid #dedede;
    }
  }
  .item {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: row-reverse;
    margin-bottom: 18px;
    @include media-breakpoint-up(md) {
      height: 200px;
      margin-bottom: 16px;
    }
    @include media-breakpoint-up(xl) {
      height: auto;
      margin-bottom: 18px;
    }
    &:first-child {
      width: 100%;
      .item__title {
        -webkit-line-clamp: 3;
        max-height: none;
      }
    }
    + .item {
      padding-top: 12px;
      border-top: 1px solid #dedede;
      @include media-breakpoint-up(md) {
        padding-top: 16px;
      }
      @include media-breakpoint-up(md) {
        padding-top: 18px;
      }
    }
    &__image {
      position: relative;
      display: block;
      width: 109px;
      padding: 0;
      @include media-breakpoint-up(md) {
        width: 50%;
      }
      img {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center center;
      }
    }
    &__title-wrapper {
      flex: 1;
      padding: 0 20px 0 0;
      @include media-breakpoint-up(md) {
        padding: 36px 32px 36px 0;
      }
      @include media-breakpoint-up(xl) {
        padding: 0 20px 0 0;
      }
      .item__label {
        display: inline-block;
        position: static;
      }
    }
    &__label {
      position: absolute;
      left: 0;
      bottom: 0;
      display: inline-block;
      padding: 4px;
      color: #fff;
      font-size: 14px;
      background-color: #000;
      @include media-breakpoint-up(md) {
        font-size: 16px;
        padding: 8px;
      }
      @include media-breakpoint-up(xl) {
        font-size: 14px;
        padding: 4px;
      }
    }
    &__title {
      display: -webkit-box;
      margin-top: 8px;
      color: #4a4a4a;
      font-size: 16px;
      line-height: 24px;
      text-align: justify;
      overflow: hidden;
      font-weight: 600;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      height: calc(24px * 3);
      @include media-breakpoint-up(md) {
        font-size: 20px;
        line-height: 140%;
        font-weight: 400;
        height: calc(20px * 1.4 * 3);
        margin-top: 12px;
      }
      @include media-breakpoint-up(xl) {
        font-weight: 600;
        font-size: 16px;
        line-height: 24px;
        color: #054f77;
        height: calc(24px * 3);
      }
    }
    @each $name, $color in $sections-color {
      &.#{$name} {
        .item__label {
          background-color: $color;
        }
      }
    }
  }
}
</style>
