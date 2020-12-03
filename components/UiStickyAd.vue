<template>
  <client-only>
    <div v-if="isMobile" v-show="isVisible" class="sticky-ad">
      <slot />
    </div>
  </client-only>
</template>

<script>
export default {
  name: 'UiStickyAd',
  data() {
    return {
      isVisible: false,
    }
  },
  computed: {
    isMobile() {
      return !this.$ua.isFromPc()
    },
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
