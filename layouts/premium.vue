<template>
  <div>
    <ContainerHeaderSectionMember class="header" />

    <div class="router-view-wrapper">
      <nuxt />
    </div>

    <div class="footer-wrapper">
      <UiFooter />
    </div>

    <ClientOnly>
      <TheGdpr />
    </ClientOnly>
  </div>
</template>

<script>
import ContainerHeaderSectionMember from '~/components/ContainerHeaderSectionMember.vue'
import UiFooter from '~/components/UiFooter.vue'
import TheGdpr from '~/components/TheGdpr.vue'

import { fireActivationEvent } from '~/utils/google-optimize.js'

export default {
  name: 'Premium',

  components: {
    ContainerHeaderSectionMember,
    UiFooter,
    TheGdpr,
  },

  mounted() {
    fireActivationEvent.bind(this)()
  },
}
</script>

<style lang="scss" scoped>
.header {
  position: fixed !important;
  top: 0;
  right: 0;
  z-index: 512;
}

.router-view-wrapper {
  padding: 64px 0 0 0;
}

.footer-wrapper {
  @include media-breakpoint-up(xl) {
    background-color: white;
    position: relative;
    z-index: 511;
  }
}
</style>
