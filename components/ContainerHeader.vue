<template>
  <header>
    <UIHeaderNav :sections="sections" :topics="topics" :partners="partners" />
  </header>
</template>

<script>
import { mapState } from 'vuex'

import UIHeaderNav from './UIHeaderNav.vue'

export default {
  name: 'ContainerHeader',
  components: {
    UIHeaderNav,
  },
  computed: {
    ...mapState({
      sections: (state) => state.sections.items ?? [],
      topics: (state) => state.topics.items ?? [],
      partners: (state) => state.partners.items ?? [],
    }),
  },
}
</script>

<style lang="sass" scoped></style>
