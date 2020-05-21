<template>
  <header>
    <UISearchBarWrapper :options="options" @sendGA="handleSendGA" />
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
import { mapGetters } from 'vuex'

import UISearchBarWrapper from './UISearchBarWrapper.vue'
import UIHeaderNavSection from './UIHeaderNavSection.vue'
import UIHeaderNavTopic from './UIHeaderNavTopic.vue'

export default {
  name: 'ContainerHeader',
  components: {
    UISearchBarWrapper,
    UIHeaderNavSection,
    UIHeaderNavTopic,
  },
  data() {
    return {
      defaultOption: { title: '全部類別' },
    }
  },
  computed: {
    ...mapGetters({
      sections: 'sections/displayedSections',
      partners: 'partners/displayedPartners',
      topics: 'topics/topics',
    }),
    options() {
      const sections = this.sections.filter(
        (section) => section.name !== 'videohub'
      )
      return [this.defaultOption, ...sections]
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
