<template>
  <LazyRenderer class="iframe-wrapper">
    <iframe
      :src="`https://www.youtube.com/embed/${videoId}`"
      class="iframe-wrapper__iframe"
      loading="lazy"
      width="100%"
      height="315"
      frameborder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
  </LazyRenderer>
</template>

<script>
export default {
  name: 'UiYoutubeIframe',
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
    object-position: center;
  }
}
</style>
