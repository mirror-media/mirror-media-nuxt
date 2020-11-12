<template>
  <video
    :src="src"
    :poster="poster"
    preload="metadata"
    controlsList="nodownload"
    controls
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
