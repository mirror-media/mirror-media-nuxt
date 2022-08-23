<template>
  <figure class="figure">
    <img v-lazy="imgUrl" class="figure__img img" alt="" />
    <UiCaption class="figure__caption">{{ caption }}</UiCaption>
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
      left: 0;
    }
    @include media-breakpoint-up(xxl) {
      width: 774px;
      margin: 0 auto;
    }
  }

  &__caption {
    margin: 16px 0 0 0;
    @include media-breakpoint-up(xxl) {
      width: 774px;
      margin: 16px auto 0 auto;
    }
  }
}
</style>
