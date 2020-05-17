<template>
  <div :class="[{ listing: isListing }]">
    <ContainerHeader />
    <nuxt />
    <UIFooter :class="[{ 'footer--listing': isListing }]" />
  </div>
</template>

<script>
import { camelizeKeys } from 'humps'

import ContainerHeader from '~/components/ContainerHeader.vue'
import UIFooter from '~/components/UIFooter.vue'

export default {
  components: {
    ContainerHeader,
    UIFooter,
  },
  async fetch() {
    const [topicsResult, partnersResult] = await Promise.allSettled([
      this.$store.dispatch('topics/fetchTopicsData'),
      this.$store.dispatch('partners/fetchPartnersData'),
    ])

    if (topicsResult.status === 'fulfilled') {
      this.commitTopicsData(topicsResult)
    }

    if (partnersResult.status === 'fulfilled') {
      this.commitPartnersData(partnersResult)
    }
  },
  computed: {
    isListing() {
      const listingRouteNames = ['section-name', 'category-name', 'author-id']
      return listingRouteNames.includes(this.$route.name)
    },
  },
  methods: {
    commitTopicsData(result) {
      const topicsData = camelizeKeys(result.value.data)

      this.$store.commit(
        'topics/setTopicsData',
        topicsData.endpoints?.topics ?? {}
      )
    },
    commitPartnersData(result) {
      this.$store.commit(
        'partners/setPartnersData',
        camelizeKeys(result.value.data)
      )
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
