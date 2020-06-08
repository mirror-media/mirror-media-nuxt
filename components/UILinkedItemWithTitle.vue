<template>
  <div :class="`align-${textPositionInMdViewport}`" class="linked-item">
    <a
      :href="href"
      class="linked-item__image"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img v-lazy="imgSrc" :alt="title" />
    </a>
    <a
      :href="href"
      :class="{ 'limit-lines': limitedLines }"
      :style="limitedLinesStyle"
      class="linked-item__title"
      target="_blank"
      rel="noopener noreferrer"
      v-text="title"
    />
  </div>
</template>

<script>
export default {
  name: 'UILinkedItemWithTitle',
  props: {
    imgSrc: {
      type: String,
      default: require('~/assets/notImage.png'),
      required: true,
    },
    href: {
      type: String,
      default: '/',
      required: true,
    },
    title: {
      type: String,
      default: '',
      required: true,
    },
    textPositionInMdViewport: {
      type: String,
      default: 'bottom',
      validator: (value) => ['right', 'bottom'].includes(value),
    },
    limitedLines: {
      type: [Number],
      default: undefined,
      validator: (value) => value > 0 && Number.isInteger(value),
    },
  },
  computed: {
    limitedLinesStyle() {
      return { '-webkit-line-clamp': this.limitedLines }
    },
  },
}
</script>

<style lang="scss" scoped>
.linked-item {
  @include media-breakpoint-up(md) {
    &.align-right {
      display: flex;
      .linked-item__image {
        width: 150px;
        padding-top: calc(150px * 0.5625);
      }
      .linked-item__title {
        flex: 1;
        margin: 0 0 0 10px;
      }
    }
  }
  &__image {
    position: relative;
    display: block;
    padding-top: 56.25%;
    img {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
  }
  &__title {
    display: block;
    color: #4a4a4a;
    font-size: 14px;
    line-height: 1.5;
    margin-top: 5px;
    @include media-breakpoint-up(md) {
      text-align: justify;
    }
    &.limit-lines {
      display: -webkit-box !important;
      -moz-orient: vertical;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
}
</style>
