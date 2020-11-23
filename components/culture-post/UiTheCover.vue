<template>
  <div class="the-cover" :style="{ height: coverHeight }">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <h1 v-html="title"></h1>

    <picture>
      <source :srcset="imgSrcLandscape" media="(min-width: 992px)" />
      <source
        :srcset="imgSrcLandscape"
        media="(min-width: 768px) and (orientation: landscape)"
      />
      <source
        :srcset="imgSrcPortrait"
        media="(min-width: 768px) and (orientation: portrait)"
      />
      <img :src="imgSrc" alt="" />
    </picture>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'UiTheCover',

  props: {
    title: {
      type: String,
      default: '',
      required: true,
    },
    picture: {
      type: Object,
      default: () => ({}),
      required: true,
    },
  },

  computed: {
    ...mapState({
      viewportHeight: (state) => state.viewport.height,
    }),
    coverHeight() {
      if (this.viewportHeight === 0) {
        return false
      }

      return `${this.viewportHeight}px`
    },

    imgSrcLandscape() {
      return this.picture.heroImage.desktop?.url
    },
    imgSrcPortrait() {
      return this.picture.mobileImage.desktop?.url
    },
    imgSrc() {
      return this.imgSrcPortrait || this.imgSrcLandscape
    },
  },
}
</script>

<style lang="scss" scoped>
.the-cover {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

h1 {
  font-family: source-han-serif-tc, 'Songti TC', serif;
  font-size: 34px;
  font-weight: 700;
  line-height: 1.44;
  color: #fff;
  text-shadow: 0 6px 6px rgba(#000, 0.5);
  width: 100%;
  max-width: 240px;
  text-align: center;
  z-index: 1;
  @include media-breakpoint-up(lg) {
    font-size: 60px;
    line-height: 1.4;
    max-width: 960px;
  }
}

picture {
  display: block;
  position: absolute;
  height: 100%;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
