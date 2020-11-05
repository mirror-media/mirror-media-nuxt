<template>
  <div class="story-video">
    <video
      :src="video.url"
      preload="metadata"
      controlsList="nodownload"
      controls
      playsinline
    />
  </div>
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
