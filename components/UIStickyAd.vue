<template>
  <div v-if="isMobile" v-show="isVisible" class="sticky-ad">
    <client-only>
      <slot />
    </client-only>
  </div>
</template>

<script>
export default {
  name: 'UIStickyAd',
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
  z-index: 500;
  > div {
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
