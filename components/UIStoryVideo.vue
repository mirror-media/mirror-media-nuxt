<template>
  <lazy-component class="story-video">
    <video
      :src="video.url"
      preload="metadata"
      controlsList="nodownload"
      controls
      playsinline
    />
  </lazy-component>
</template>

<script>
export default {
  name: 'UIStoryVideo',
  props: {
    video: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.story-video {
  background-color: #000;
  video {
    width: 100%;
  }
}
</style>
