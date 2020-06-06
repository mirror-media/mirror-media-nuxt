<template>
  <lazy-component class="iframe-wrapper">
    <iframe
      :src="`https://www.youtube.com/embed/${videoId}`"
      class="iframe-wrapper__iframe"
      width="560"
      height="315"
      frameborder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
  </lazy-component>
</template>

<script>
export default {
  name: 'UIYoutubeIframe',
  props: {
    videoId: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.iframe-wrapper {
  position: relative;
  padding-top: 56.25%;
  overflow: hidden;
  &__iframe {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
}
</style>
