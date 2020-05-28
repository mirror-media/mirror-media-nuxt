<template>
  <UIYoutubeSubscribe :channelId="channelId" />
</template>
<script>
import UIYoutubeSubscribe from '~/components/UIYoutubeSubscribe.vue'

export default {
  name: 'ContainerYoutubeSubscribe',
  components: {
    UIYoutubeSubscribe,
  },
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
      const hasInjected =
        window.gapi || document.querySelector('#js-yt-platform')
      if (!hasInjected) {
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
