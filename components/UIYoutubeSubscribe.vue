<template>
  <div>
    <div
      :data-channelid="channelId"
      class="g-ytsubscribe"
      data-layout="full"
      data-count="hidden"
    />
  </div>
</template>

<script>
// Document: https://developers.google.com/youtube/youtube_subscribe_button

export default {
  name: 'UIYoutubeSubscribe',
  props: {
    channelId: {
      type: String,
      required: true,
    },
  },
  mounted() {
    window.addEventListener('load', this.init)
  },
  beforeDestroy() {
    window.removeEventListener('load', this.init)
  },
  methods: {
    init() {
      const hasInjectedSDK =
        window.gapi || document.querySelector('#js-yt-platform')
      if (!hasInjectedSDK) {
        const youtubePlatformScript = document.createElement('script')
        youtubePlatformScript.setAttribute('id', 'js-yt-platform')
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
