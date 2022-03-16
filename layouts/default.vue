<template>
  <div
    :class="[
      {
        listing: isListing,
        'listing--white-background': isSearchPage,
      },
    ]"
  >
    <ContainerHeaderPremium v-if="isPremium" />
    <ContainerHeader v-else />
    <nuxt />
    <UiFooter :class="[{ 'footer--listing': isListing }]" />

    <ClientOnly>
      <TheGdpr />
    </ClientOnly>
  </div>
</template>

<script>
import { ENV } from '~/configs/config.js'
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
    isPremium() {
      if (ENV === 'staging' || ENV === 'prod') return false
      const memberType = this.$store?.state['membership-subscribe']?.basicInfo
        .type
      return (
        memberType === 'subscribe_monthly' || memberType === 'subscribe_yearly'
      )
    },
  },

  mounted() {
    fireActivationEvent.bind(this)()
  },
}
</script>

<style lang="scss" scoped>
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
