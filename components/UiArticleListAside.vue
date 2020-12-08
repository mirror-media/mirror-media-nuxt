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
        >
          <img :src="item.imgSrc" alt="" />
          <div class="item__label">{{ item.label }}</div>
        </a>

        <div class="item__title-wrapper">
          <div class="item__label">{{ item.label }}</div>
          <a
            :href="item.href"
            class="item__title"
            target="_blank"
            rel="noopener noreferrer"
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
      margin-top: 20px;
    }
    &__image {
      position: relative;
      display: block;
      padding-top: 66.66%;
      @include media-breakpoint-up(xl) {
        width: 50%;
        margin-right: 10px;
        padding: 0;
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
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        height: calc(16px * 1.14 * 3);
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
