<template>
  <div class="share-light">
    <button @click="shareFacebook">
      <img
        src="/deprecated/topic-page/assets/mirrormedia/icon/share-fb.png"
        alt="分享至 Facebook"
      />
    </button>
    <button @click="shareLine">
      <img
        src="/deprecated/topic-page/assets/mirrormedia/icon/share-line.png"
        alt="分享至 Line"
      />
    </button>
  </div>
</template>
<script>
import { sendGaClickEvent, shareLine, shareFacebook } from '../../util/comm'

export default {
  name: 'ShareLight',
  props: {
    gtmCategory: {
      type: String,
      default: 'header',
    },
  },
  methods: {
    shareFacebook() {
      shareFacebook({ route: this.$route.path })
      sendGaClickEvent(this.gtmCategory, 'share fb')
    },
    shareLine() {
      shareLine({
        route: this.$route.path,
        title: document
          .querySelector('meta[property="og:title"]')
          .getAttribute('content'),
      })
      sendGaClickEvent(this.gtmCategory, 'share line')
    },
  },
}
</script>
<style lang="stylus" scoped>
.share-light
  display flex
  button
    display inline-block
    width 35px
    padding 0
    font-size 0
    background-color transparent
    border none
    cursor pointer
    & + button
      margin-left 10px
    img
      width 100%
</style>
