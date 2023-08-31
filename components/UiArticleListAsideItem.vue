<template>
  <div class="item" :class="item.sectionName">
    <a
      :href="item.href"
      class="item__image"
      target="_blank"
      rel="noopener noreferrer"
      @click="$emit('sendGa')"
    >
      <img
        :src="item.imgSrc || require('~/assets/default-og-img.png')"
        alt=""
      />
      <div class="item__label">{{ item.label }}</div>
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
</template>

<script>
export default {
  name: 'UiArticleListAsideItem',
  props: {
    item: {
      type: Object,
      required: true,
      default: () => {
        return {}
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.item {
  position: relative;
  width: calc(50% - 5px);
  @include media-breakpoint-up(xl) {
    display: flex;
    width: 100%;
  }
  &:first-child {
    width: 100%;
    .item__title {
      -webkit-line-clamp: 2;
      max-height: calc(24px * 2);
      @include media-breakpoint-up(xl) {
        -webkit-line-clamp: 3;
        max-height: none;
      }
    }
  }
  + .item {
    margin-top: 12px;
  }
  &__image {
    position: relative;
    display: block;
    padding-top: 66.66%;
    @include media-breakpoint-up(xl) {
      padding: 0;
      width: 120px;
      height: 80px;
      margin-right: 12px;
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
    .item__label {
      @include media-breakpoint-up(xl) {
        display: none;
      }
    }
  }
  &__title-wrapper {
    @include media-breakpoint-up(xl) {
      flex: 1;
    }
    .item__label {
      display: none;
      @include media-breakpoint-up(xl) {
        display: inline-block;
        position: static;
        + * {
          margin-top: 12px;
        }
      }
    }
  }
  &__label {
    position: absolute;
    left: 0;
    bottom: 0;
    display: inline-block;
    padding: 0 10px;
    color: #fff;
    font-size: 14px;
    line-height: 25px;
    background-color: #000;
  }
  &__title {
    display: -webkit-box;
    margin: 4px 0 0;
    color: #34495e;
    font-size: 19px;
    line-height: 24px;
    text-align: justify;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    max-height: calc(24px * 3);
    overflow: hidden;
    @include media-breakpoint-up(xl) {
      margin: 0;
      font-size: 16px;
      font-weight: 700;
      line-height: 1.15;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      height: calc(16px * 1.14 * 2);
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
</style>
