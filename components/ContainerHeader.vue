<template>
  <header>
    <div class="header-search">
      <UISearchBarWrapper :options="options" @sendGA="handleSendGA" />
      <UIOthersList
        class="others-list"
        :links="otherLinks"
        eventCategory="header"
        @sendGA="handleSendGA"
      />
    </div>
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
import _ from 'lodash'

import UISearchBarWrapper from './UISearchBarWrapper.vue'
import UIOthersList from './UIOthersList.vue'
import UIHeaderNavSection from './UIHeaderNavSection.vue'
import UIHeaderNavTopic from './UIHeaderNavTopic.vue'

import { OTHER_LINKS } from '~/constants/index'

export default {
  name: 'ContainerHeader',
  components: {
    UISearchBarWrapper,
    UIOthersList,
    UIHeaderNavSection,
    UIHeaderNavTopic,
  },
  data() {
    return {
      defaultOption: { title: '全部類別' },
      otherLinksEventLabel: {
        subscribe: {
          eventLabel: 'more subscribe',
        },
        magazine: {
          eventLabel: 'more magazine',
        },
        auth: {
          eventLabel: 'more auth',
        },
        ad: {
          eventLabel: 'more ad',
        },
        campaign: {
          eventLabel: 'more campaign',
        },
        downloadApp: {
          eventLabel: 'more download',
        },
      },
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
    otherLinks() {
      return _.merge(OTHER_LINKS, this.otherLinksEventLabel)
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
.header-search {
  display: flex;
  align-items: center;
  z-index: 149;
  position: relative;
}
.others-list {
  display: none;
  @include media-breakpoint-up(xl) {
    display: block;
  }
}
</style>
