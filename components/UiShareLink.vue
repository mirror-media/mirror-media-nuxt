<template>
  <div class="share-link-wrapper">
    <SvgLinkLogo class="icon" @click="handleClickIcon" />
    <transition name="fade">
      <div v-show="shouldShowAlert" class="alert">已複製連結</div>
    </transition>
  </div>
</template>

<script>
import SvgLinkLogo from '~/assets/link-logo.svg?inline'

export default {
  components: {
    SvgLinkLogo,
  },
  data() {
    return {
      shouldShowAlert: false,
    }
  },
  methods: {
    handleAlertTimer() {
      this.shouldShowAlert = true
      const timer = setTimeout(() => {
        this.shouldShowAlert = false
        clearTimeout(timer)
      }, 3000)
    },
    handleCopyLinkCurrentUrl() {
      window.navigator.clipboard.writeText(window.location.href)
    },
    handleClickIcon() {
      this.handleAlertTimer()
      this.handleCopyLinkCurrentUrl()
    },
  },
}
</script>

<style lang="scss" scoped>
.icon {
  cursor: pointer;
}

.alert {
  position: fixed;
  top: 64px;
  left: calc((100vw - min(80vw, 480px)) / 2);
  color: white;
  background: rgba(0, 0, 0, 0.87);
  border-radius: 2px;
  z-index: 99999999;
  margin: 0 auto;
  width: 80vw;
  max-width: 480px;
  padding: 12px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
