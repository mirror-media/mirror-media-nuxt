<template>
  <LazyRenderer @load="init">
    <div class="youtube-subscribe">
      <img :src="imgSrc" @click="openChannel" />
      <section>
        <div class="youtube-subscribe__name" @click="openChannel">
          {{ channelTitle }}
        </div>
        <div
          :data-channelid="channelId"
          class="g-ytsubscribe"
          data-layout="default"
          data-count="hidden"
        />
      </section>
    </div>
  </LazyRenderer>
</template>

<script>
export default {
  name: 'UiYoutubeSubscribe',
  props: {
    channelName: {
      type: String,
      required: true,
    },
    channelId: {
      type: String,
      required: true,
    },
    channelTitle: {
      type: String,
      required: true,
    },
  },
  computed: {
    imgSrc() {
      const img = require(`~/assets/youtube-icon/${this.channelName}.png`)
      return img
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
    handleClickBtn() {
      window.open(
        `https://www.youtube.com/channel/${this.channelId}?sub_confirmation=1`,
        '_blank'
      )
    },
    openChannel() {
      window.open(`https://www.youtube.com/channel/${this.channelId}`, '_blank')
    },
  },
}
</script>

<style lang="scss" scoped>
.youtube-subscribe {
  display: flex;
  width: 105px;

  *:hover {
    cursor: pointer;
  }

  img {
    width: 49px;
    height: 49px;
    margin-right: 8px;
  }

  &__name {
    font-size: 13px;
    line-height: 18px;
    color: rgba(0, 0, 0, 0.87);
    margin-bottom: 4px;
    &:hover {
      text-decoration: underline;
      color: rgba(46, 44, 44, 0.87);
    }
  }
  &__btn {
    font-weight: 600;
    font-size: 10px;
    line-height: 14px;
    color: #fff;
    background: #af1f07;
    padding: 5px 12px;
    border-radius: 2px;
    &:hover {
      background: #e83213;
    }
  }
}
</style>

<!--
  Document: https://developers.google.com/youtube/youtube_subscribe_button
-->
