<template>
  <header>
    <ContainerSearchBar :sections="displayedSections" />
    <nav class="header-nav">
      <UIHeaderNavSection
        :sections="displayedSections"
        :partners="displayedPartners"
        @sendGA="handleSendGA"
      />
      <UIHeaderNavTopic :topics="topics" @sendGA="handleSendGA" />
    </nav>
  </header>
</template>

<script>
import { mapState } from 'vuex'

import ContainerSearchBar from './ContainerSearchBar.vue'
import UIHeaderNavSection from './UIHeaderNavSection.vue'
import UIHeaderNavTopic from './UIHeaderNavTopic.vue'

export default {
  name: 'ContainerHeader',
  components: {
    ContainerSearchBar,
    UIHeaderNavSection,
    UIHeaderNavTopic,
  },
  computed: {
    ...mapState({
      sections: (state) => state.sections.data.items ?? [],
      topics: (state) => state.topics.data.items ?? [],
      partners: (state) => state.partners.data.items ?? [],
    }),
    displayedSections() {
      return this.sections.filter((section) => section.isFeatured)
    },
    displayedPartners() {
      return this.partners.filter((partner) => partner.public)
    },
  },
  methods: {
    handleSendGA(param = {}) {
      this.$ga.event(param)
    },
  },
}
</script>

<style lang="scss" scoped>
header {
  background-color: #f5f5f5;
}
.header-nav {
  box-shadow: 0 2px 1px rgba(#000, 0.2);
  position: relative;
  z-index: 99;
  @include media-breakpoint-up(xl) {
    box-shadow: 0 0 5px #ccc;
  }
}
</style>
