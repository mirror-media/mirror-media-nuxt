<template>
  <figure class="figure">
    <img v-lazy="imgUrl" class="figure__img img" alt="" />
    <UiCaption class="figure__caption" v-text="caption" />
  </figure>
</template>

<script>
import UiCaption from './UiCaption.vue'

export default {
  components: { UiCaption },
  props: {
    imgUrl: {
      type: String,
      default: '',
    },
    caption: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
.figure {
  width: 100%;

  &__img {
    width: 100vw;
    max-width: 100vw;
    object-fit: contain;
    position: relative;
    left: -20px;
    @include media-breakpoint-up(md) {
      left: calc((100vw - 608px) / 2 * -1);
    }
    @include media-breakpoint-up(xl) {
      width: 720px;
      left: calc(((720px - 640px) / 2) * -1);
    }
  }

  &__caption {
    margin: 16px 0 0 0;
  }
}
</style>
