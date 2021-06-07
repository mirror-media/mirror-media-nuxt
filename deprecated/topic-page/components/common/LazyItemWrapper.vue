<template>
  <div :id="`lazyitemwrp-${id}`" class="plate-vue-lazy-item-wrapper">
    <div v-show="isVisibleYet || isServerSide" v-if="isVisibleYet || !strict">
      <slot />
    </div>
  </div>
</template>
<script>
import uuidv4 from 'uuid/v4'
import verge from 'verge'
import { currentYPosition, elmYPosition } from '../../../kc-scroll'

// const debug = require('debug')('CLIENT:LAZYITEM')
export default {
  name: 'LazyItemWrapper',
  props: {
    offset: {},
    position: {},
    loadAfterPageLoaded: {
      default: false,
    },
    strict: {
      // on strict mode, content won't be rendered on server-side
      default: false,
    },
  },
  data() {
    return {
      id: '',
      isVisibleYet: false,
      handler: {},
    }
  },
  computed: {
    isServerSide() {
      return process.env.VUE_ENV === 'server'
    },
  },
  watch: {
    id() {
      if (!this.loadAfterPageLoaded) {
        this.handler()
      }
    },
    '$route.fullPath'() {
      if (!this.loadAfterPageLoaded) {
        window.removeEventListener('scroll', this.handler)
        this.isVisibleYet = false
        this.setupEventListener()
        this.handler()
      } else {
        window.removeEventListener('load', this.handler)
        this.isVisibleYet = true
        this.handler = null
      }
    },
  },
  mounted() {
    this.setupEventListener()
    this.id = uuidv4()
  },
  methods: {
    setupEventListener() {
      if (!this.loadAfterPageLoaded) {
        this.handler = () => {
          if (this.isVisibleYet) {
            return
          }
          const currPosTop = currentYPosition()
          const deviceHeight = verge.viewportH()
          const eleTop = elmYPosition(`#lazyitemwrp-${this.id}`)
          const offset = this.offset || 0
          const checkPoint = this.position || eleTop - offset
          if (checkPoint < currPosTop + deviceHeight) {
            this.isVisibleYet = true
            window.removeEventListener('scroll', this.handler)
            this.handler = null
          }
        }
        window.addEventListener('scroll', this.handler)
      } else {
        this.handler = () => {
          this.isVisibleYet = true
          window.removeEventListener('load', this.handler)
          this.handler = null
        }
        if (
          document.readyState === 'complete' ||
          document.readyState === 'interactive'
        ) {
          this.isVisibleYet = true
          this.handler = null
        } else {
          window.addEventListener('load', this.handler)
        }
      }
    },
  },
}
</script>
<style lang="stylus" scoped></style>
