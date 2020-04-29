<template>
  <header>
    <UIHeaderNav :sections="sections" />
  </header>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'

import UIHeaderNav from './UIHeaderNav.vue'

export default {
  name: 'ContainerHeader',
  components: {
    UIHeaderNav,
  },
  computed: {
    ...mapState({
      sections: (state) => _.get(state, 'sections._items', []),
      topics: (state) => _.get(state, 'topics._items', []),
      partners: (state) => _.get(state, 'partners._items', []),
    }),
  },
}
</script>

<style lang="sass" scoped></style>
