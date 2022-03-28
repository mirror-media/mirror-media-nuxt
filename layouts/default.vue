<template>
  <div
    class="container"
    :class="[
      {
        listing: isListing,
        'listing--white-background': isSearchPage,
      },
    ]"
  >
    <ClientOnly>
      <ContainerHeaderPremium v-if="isPremiumMember" />
      <ContainerHeader v-else />
    </ClientOnly>
    <div class="content">
      <nuxt />
    </div>
    <UiFooter :class="[{ 'footer--listing': isListing }]" />

    <ClientOnly>
      <TheGdpr />
    </ClientOnly>
  </div>
</template>

<script>
import ContainerHeaderPremium from '~/components/ContainerHeaderPremium.vue'
import ContainerHeader from '~/components/ContainerHeader.vue'
import UiFooter from '~/components/UiFooter.vue'
import TheGdpr from '~/components/TheGdpr.vue'

import { useMemberPageViewToFbPixel } from '~/composition/fb-pixel.js'
import { useViewport } from '~/composition/viewport.js'
import { fireActivationEvent } from '~/utils/google-optimize.js'

export default {
  components: {
    ContainerHeader,
    UiFooter,
    TheGdpr,
    ContainerHeaderPremium,
  },
  setup() {
    useViewport()
    useMemberPageViewToFbPixel()
  },

  async fetch() {
    await Promise.all([
      this.$store.dispatch('partners/fetchPartnersData'),
      this.$store.dispatch('topics/fetchTopicsData'),
    ])
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters['membership/isLoggedIn']
    },
    isListing() {
      const listingRouteNames = [
        'section-name',
        'category-name',
        'category-marketing',
        'author-id',
        'section-topic',
        'search-keyword',
        'topic-id',
        'tag-id',
        'externals-name',
      ]
      return listingRouteNames.includes(this.$route.name)
    },
    isSearchPage() {
      return this.$route.name === 'search-keyword'
    },
    isPremiumMember() {
      return this.$store?.getters?.['membership-subscribe/isPremiumMember']
    },
  },

  mounted() {
    fireActivationEvent.bind(this)()
  },
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  .content {
    flex: 1;
  }
}

.listing {
  background-color: #f2f2f2;
  padding: 0 0 60px 0;
  @include media-breakpoint-up(xl) {
    padding: 0;
  }

  // most of the listing page's background-color is #f2f2f2, except search page
  &--white-background {
    background-color: white;
  }
}

.footer {
  &--listing {
    margin: 0 32px;
    @include media-breakpoint-up(xl) {
      max-width: 1024px;
      margin: 60px auto 0 auto;
    }
  }
}
</style>
