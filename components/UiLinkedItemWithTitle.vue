<template>
  <div :class="`align-${textPositionInMdViewport}`" class="linked-item">
    <a
      :href="href"
      :target="target"
      class="linked-item__image"
      rel="noopener noreferrer"
      @click="handleClick"
    >
      <img v-lazy="imgSrc" :alt="title" />
    </a>
    <a
      :href="href"
      :class="{ 'limited-lines': limitedLines }"
      :style="limitedLinesStyle"
      :target="target"
      class="linked-item__title"
      rel="noopener noreferrer"
      @click="handleClick"
      v-text="title"
    />
  </div>
</template>

<script>
import { SITE_OG_IMG } from '~/constants/index.js'

export default {
  name: 'UiLinkedItemWithTitle',
  props: {
    imgSrc: {
      type: String,
      default: SITE_OG_IMG,
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
    target: {
      type: String,
      default: '_blank',
    },
    textPositionInMdViewport: {
      type: String,
      default: 'bottom',
      validator: (value) => ['right', 'bottom'].includes(value),
    },
    limitedLines: {
      type: Number,
      default: undefined,
      validator: (value) => value > 0 && Number.isInteger(value),
    },
  },
  computed: {
    limitedLinesStyle() {
      return { '-webkit-line-clamp': this.limitedLines }
    },
  },
  methods: {
    handleClick() {
      this.$emit('click')
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
    &.limited-lines {
      display: -webkit-box !important;
      -moz-orient: vertical;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
}
</style>
