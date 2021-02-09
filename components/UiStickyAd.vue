<template>
  <div v-show="isVisible" class="sticky-ad">
    <ContainerGptAd :pageKey="pageKey" adKey="MB_ST" />
  </div>
</template>

<script>
import ContainerGptAd from '~/components/ContainerGptAd.vue'

export default {
  name: 'UiStickyAd',

  components: {
    ContainerGptAd,
  },

  props: {
    pageKey: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      isVisible: false,
    }
  },

  mounted() {
    window.addEventListener('scroll', this.makeAdVisible, { passive: true })
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.makeAdVisible)
  },
  methods: {
    makeAdVisible() {
      this.isVisible = true
      window.removeEventListener('scroll', this.makeAdVisible)
    },
  },
}
</script>

<style lang="scss" scoped>
.sticky-ad {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 419;

  &::v-deep > div {
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
