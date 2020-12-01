<template>
  <div class="story-figure" :class="alignment">
    <figure>
      <img v-lazy="imgSrcTablet" alt="" @click="openLightbox" />
      <figcaption v-if="description">
        {{ description }}
      </figcaption>
    </figure>

    <div
      v-if="shouldOpenLightbox"
      ref="lightbox"
      class="lightbox"
      @click="closeLightbox"
    >
      <img v-lazy="imgSrcDesktop" alt="" @click.stop />

      <button type="button" />
    </div>
  </div>
</template>

<script>
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'

export default {
  name: 'UiStoryFigure',

  props: {
    content: {
      type: Object,
      default: () => ({}),
      require: true,
    },
  },

  data() {
    return {
      shouldOpenLightbox: false,
    }
  },

  computed: {
    alignment() {
      // 不需要 'center' 來判斷樣式，故排除
      return this.content.alignment !== 'center' && this.content.alignment
    },
    description() {
      return this.content.description
    },
    imgSrcTablet() {
      return this.content.tablet?.url
    },
    imgSrcDesktop() {
      return this.content.desktop?.url
    },
  },

  beforeDestroy() {
    enableBodyScroll(this.$refs.lightbox)
  },

  methods: {
    async openLightbox() {
      this.shouldOpenLightbox = true

      // 避免 DOM 尚未更新，導致 this.$refs.lightbox 為空
      await this.$nextTick()
      disableBodyScroll(this.$refs.lightbox)
    },
    closeLightbox() {
      this.shouldOpenLightbox = false

      enableBodyScroll(this.$refs.lightbox)
    },
  },
}
</script>

<style lang="scss" scoped>
@include media-breakpoint-up(md) {
  .story-figure {
    &.left,
    &.right {
      clear: both;
      width: 300px;
      margin-bottom: 30px;

      figcaption {
        border-bottom: 2px solid #255577;
        padding-bottom: 10px;
      }
    }

    &.left {
      float: left;
      margin-right: 20px;
    }

    &.right {
      float: right;
      margin-left: 20px;
    }
  }
}

figure img {
  cursor: pointer;
}

.lightbox {
  width: 100%;
  height: 100%;
  background-color: rgba(#000, 0.7);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 819;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  cursor: pointer;

  img {
    width: auto;
    max-width: 90%;
    max-height: 90%;
    cursor: auto;
  }
}

button {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 20px;
  height: 20px;
  background-image: url(~assets/close_white@2x.png);
  background-size: 20px;
  background-position: center;
  background-repeat: no-repeat;
  outline: none;
}
</style>
