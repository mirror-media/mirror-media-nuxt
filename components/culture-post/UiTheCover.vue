<template>
  <div class="the-cover" :style="{ height: coverHeight }">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <h1 v-html="title"></h1>

    <ClientOnly v-if="videoSrc">
      <UiStoryVideo
        :src="videoSrc"
        :poster="videoPoster"
        :isMuted="true"
        :isAutoplay="true"
        :shouldShowControl="false"
        :isLoop="true"
        class="video"
      />
    </ClientOnly>

    <picture v-else>
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
import UiStoryVideo from '~/components/UiStoryVideo.vue'

export default {
  name: 'UiTheCover',
  components: {
    UiStoryVideo,
  },

  props: {
    title: {
      type: String,
      default: '',
      required: true,
    },
    video: {
      type: Object,
      default: () => ({}),
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

    videoSrc() {
      return this.video.src
    },
    videoPoster() {
      return this.video.poster
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
  text-shadow: 0 6px 8px rgba(#000, 0.6);
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

.video {
  position: absolute;
  height: 100%;
}

picture {
  position: relative;
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  &::after {
    content: '';
    position: absolute;
    display: block;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15));
  }
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
