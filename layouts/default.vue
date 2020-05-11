<template>
  <div>
    <ContainerHeader />
    <nuxt />
    <UIFooter />
  </div>
</template>

<script>
import { camelizeKeys } from 'humps'

import ContainerHeader from '~/components/ContainerHeader.vue'
import UIFooter from '~/components/UIFooter.vue'

export default {
  components: {
    UIFooter,
    ContainerHeader,
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

<style lang="sass" scoped></style>
