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
      this.$store.dispatch('fetchTopicsData'),
      this.$store.dispatch('fetchPartnersData'),
    ])

    if (topicsResult.status === 'fulfilled') {
      this.commitTopicsDataToStore(topicsResult)
    }

    if (partnersResult.status === 'fulfilled') {
      this.commitPartnersDataToStore(partnersResult)
    }
  },
  methods: {
    commitTopicsDataToStore(result) {
      const topicsData = camelizeKeys(result.value.data)

      this.$store.commit('setTopicsData', topicsData.endpoints?.topics ?? {})
    },
    commitPartnersDataToStore(result) {
      this.$store.commit('setPartnersData', camelizeKeys(result.value.data))
    },
  },
}
</script>

<style lang="sass" scoped></style>
