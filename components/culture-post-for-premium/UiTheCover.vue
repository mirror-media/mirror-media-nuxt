<template>
  <div class="the-cover" :style="{ height: coverHeight }">
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
  height: calc(100vw * 0.66875);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 2;
  @include media-breakpoint-up(xl) {
    height: 800px;
  }
}

.video {
  position: absolute;
  height: 100%;
  object-fit: contain !important;
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
  }
}

img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
