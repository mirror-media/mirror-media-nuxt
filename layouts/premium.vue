<template>
  <div>
    <ContainerHeaderSectionMember
      class="header"
      @sidebarToggle="handleIndexActive(!isIndexActive)"
    />

    <UiArticleIndex
      class="article-index"
      :isPremium="true"
      :items="[]"
      :currentIndex="0"
      :isIndexActive="isIndexActive"
      :bottomStyle="'white'"
      @closeIndex="handleIndexActive(false)"
      @openIndex="handleIndexActive(true)"
    />
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
import UiArticleIndex from '~/components/culture-post-for-premium/UiArticleIndex.vue'
import UiFooter from '~/components/UiFooter.vue'
import TheGdpr from '~/components/TheGdpr.vue'

import { useViewport } from '~/composition/viewport.js'
import { fireActivationEvent } from '~/utils/google-optimize.js'
import { useMemberPageViewToFbPixel } from '~/composition/fb-pixel.js'

export default {
  name: 'Premium',
  setup() {
    useViewport()
    useMemberPageViewToFbPixel()
  },
  components: {
    ContainerHeaderSectionMember,
    UiArticleIndex,
    UiFooter,
    TheGdpr,
  },

  data() {
    return {
      isIndexActive: false,
    }
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters['membership/isLoggedIn']
    },
  },
  mounted() {
    fireActivationEvent.bind(this)()
  },

  methods: {
    handleIndexActive(isActive) {
      this.isIndexActive = isActive
    },
  },
}
</script>

<style lang="scss" scoped>
.header {
  position: fixed !important;
  top: 0;
  right: 0;
  z-index: 512 !important;
}

.article-index {
  position: relative;
  z-index: 513 !important;
}

.router-view-wrapper {
  padding: 64px 0 0 0;
}

.footer-wrapper {
  @include media-breakpoint-up(xl) {
    background-color: white;
    position: relative;
    z-index: 511 !important;
  }
}
</style>
