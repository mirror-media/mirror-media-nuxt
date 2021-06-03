<template>
  <img
    :id="`img-${id}`"
    src="/assets/mirrormedia/icon/loading.gif"
    class="plate-vue-lazy-image"
    :class="{ loading: !isVirtualImgLoaded }"
    :alt="caption"
  />
</template>
<script>
import uuidv4 from 'uuid/v4'
import verge from 'verge'
import { currentYPosition, elmYPosition } from '../../../kc-scroll'
export default {
  name: 'LazyImage',
  props: {
    caption: {},
    src: {},
    srcset: {},
  },
  data() {
    return {
      id: '',
      isVirtualImgLoaded: false,
      isVirtualImgCheckedOut: false,
    }
  },
  watch: {
    '$route.fullPath'() {
      window.removeEventListener('scroll', this.handler)
      this.isVisibleYet = false
      this.isVirtualImgCheckedOut = false
      window.addEventListener('scroll', this.handler)
    },
  },
  mounted() {
    window.addEventListener('scroll', this.handler)
    this.id = uuidv4()
    this.$forceUpdate()
  },
  updated() {
    this.handler()
  },
  methods: {
    // eslint-disable-next-line require-await
    async lazyLoad() {
      const lazyImg = document.createElement('img')
      lazyImg.onload = () => {
        this.isVirtualImgLoaded = true
        this.srcset && this.$el.setAttribute('srcset', this.srcset)
        this.$el.setAttribute('src', this.src)
      }
      this.caption && lazyImg.setAttribute('alt', this.caption)
      this.srcset && lazyImg.setAttribute('srcset', this.srcset)
      lazyImg.setAttribute('src', this.src)
    },
    handler() {
      if (this.isVirtualImgCheckedOut) {
        return
      }
      const deviceHeight = verge.viewportH()
      const currPosBottom = currentYPosition() + deviceHeight
      const eleTop = elmYPosition(`#img-${this.id}`)
      if (eleTop < currPosBottom) {
        this.isVirtualImgCheckedOut = true
        this.lazyLoad().then(() => {
          window.removeEventListener('scroll', this.handler)
        })
      }
    },
  },
}
</script>
<style lang="stylus" scoped>
img.loading
  max-width 100px
  width 100%
  object-fit contain!important
  margin 0 auto
</style>
