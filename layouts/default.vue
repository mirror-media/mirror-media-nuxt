<template>
  <div
    :class="[
      {
        listing: isListing,
        'listing--white-background': isSearchPage,
      },
    ]"
  >
    <ContainerHeader />
    <nuxt />
    <UIFooter :class="[{ 'footer--listing': isListing }]" />
  </div>
</template>

<script>
import ContainerHeader from '~/components/ContainerHeader.vue'
import UIFooter from '~/components/UIFooter.vue'

import { useViewport } from '~/composition/viewport.js'

export default {
  components: {
    ContainerHeader,
    UIFooter,
  },
  setup() {
    useViewport()
  },

  async fetch() {
    await Promise.all([
      this.$store.dispatch('partners/fetchPartnersData'),
      this.$store.dispatch('topics/fetchTopicsData'),
    ])
  },

  computed: {
    isListing() {
      const listingRouteNames = [
        'section-name',
        'category-name',
        'author-id',
        'section-topic',
        'search-keyword',
        'topic-id',
        'tag-id',
      ]
      return listingRouteNames.includes(this.$route.name)
    },
    isSearchPage() {
      return this.$route.name === 'search-keyword'
    },
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
