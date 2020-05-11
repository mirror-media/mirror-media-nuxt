<template>
  <header>
    <nav class="header-nav">
      <UIHeaderNavSection
        :sections="sections"
        :partners="partners"
        @sendGA="handleSendGA"
      />
      <UIHeaderNavTopic :topics="topics" @sendGA="handleSendGA" />
    </nav>
  </header>
</template>

<script>
import { mapState } from 'vuex'

import UIHeaderNavSection from './UIHeaderNavSection.vue'
import UIHeaderNavTopic from './UIHeaderNavTopic.vue'

export default {
  name: 'ContainerHeader',
  components: {
    UIHeaderNavSection,
    UIHeaderNavTopic,
  },
  data() {
    return {
      gaError: 'please provide a valid argument in handleSendGA',
    }
  },
  computed: {
    ...mapState({
      sections: (state) => state.sections.data.items ?? [],
      topics: (state) => state.topics.data.items ?? [],
      partners: (state) => state.partners.data.items ?? [],
    }),
  },
  methods: {
    handleSendGA(param = {}) {
      const expectedKeys = ['eventCategory', 'eventAction', 'eventLabel']
      const paramValid = expectedKeys.every(function validateParam(key) {
        return Object.prototype.hasOwnProperty.call(param, key)
      })

      if (!paramValid) {
        throw new Error(this.gaError)
      }

      this.$ga.event(param)
    },
  },
}
</script>

<style lang="sass" scoped>
.header-nav
  background-color: #f5f5f5
  box-shadow: 0 2px 1px rgba(#000, 0.2)
  z-index: 99
  @include media-breakpoint-up(xl)
    box-shadow: 0 0 5px #ccc
</style>
