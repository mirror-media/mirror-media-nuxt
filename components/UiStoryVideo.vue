<template>
  <video
    :src="src"
    :poster="poster"
    :muted="isMuted"
    :autoplay="isAutoplay"
    preload="metadata"
    controlsList="nodownload"
    :controls="shouldShowControl"
    :loop="isLoop"
    playsinline
  />
</template>

<script>
export default {
  name: 'UiStoryVideo',

  props: {
    src: {
      type: String,
      required: true,
    },
    poster: {
      type: [String, Boolean],
      default: false,
    },
    isMuted: {
      type: Boolean,
      default: false,
    },
    isAutoplay: {
      type: Boolean,
      default: false,
    },
    shouldShowControl: {
      type: Boolean,
      default: true,
    },
    isLoop: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
video {
  width: 100%;
  outline: none;
  object-fit: cover;
}
</style>
