<template>
  <lazy-component class="story-video">
    <video
      :id="`video-${video.id}`"
      preload="metadata"
      controlsList="nodownload"
      controls
      playsinline
    >
      <source :src="video.url" :type="video.filetype" />
    </video>
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
