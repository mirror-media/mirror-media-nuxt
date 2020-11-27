<!--
  Document: https://developers.google.com/youtube/youtube_subscribe_button
-->
<template>
  <LazyRenderer @load="init">
    <!-- "g-ytsubscribe" is a required class setting by youtube, do not remove. -->
    <div
      :data-channelid="channelId"
      class="g-ytsubscribe"
      data-layout="full"
      data-count="hidden"
    />
  </LazyRenderer>
</template>

<script>
export default {
  name: 'UiYoutubeSubscribe',
  props: {
    channelId: {
      type: String,
      required: true,
    },
  },
  methods: {
    init() {
      const hasInjectedSDK =
        window.gapi || document.querySelector('#js-yt-platform')
      if (!hasInjectedSDK) {
        const youtubePlatformScript = document.createElement('script')
        youtubePlatformScript.setAttribute('id', 'js-yt-platform')
        youtubePlatformScript.setAttribute('defer', 'true')
        youtubePlatformScript.setAttribute(
          'src',
          'https://apis.google.com/js/platform.js'
        )
        document.head.appendChild(youtubePlatformScript)
      }
    },
  },
}
</script>
