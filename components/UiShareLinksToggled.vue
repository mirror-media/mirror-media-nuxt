<template>
  <div>
    <transition name="fade">
      <UiShareLinksHasCopyLink
        v-show="shouldShowShareLinks"
        :direction="'vertical'"
      />
    </transition>
    <SvgShareToggle
      class="share-toggle-icon"
      @click="handleClickShareToggleIcon"
    />
  </div>
</template>

<script>
import UiShareLinksHasCopyLink from './UiShareLinksHasCopyLink.vue'
import SvgShareToggle from '~/assets/share-toggle.svg?inline'

export default {
  components: {
    UiShareLinksHasCopyLink,
    SvgShareToggle,
  },
  data() {
    return {
      shouldShowShareLinks: false,
    }
  },
  methods: {
    handleClickShareToggleIcon() {
      this.shouldShowShareLinks = !this.shouldShowShareLinks
    },
  },
}
</script>

<style lang="scss" scoped>
.share-toggle-icon {
  margin: 12px 0 0 0;
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
