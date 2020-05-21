<template>
  <section class="search-bar-container">
    <UISearchBar
      :options="options"
      @setSelectedOption="selectedOption = $event"
      @setText="keyword = $event"
      @search="search"
    />
    <UISearchBarDesktop
      :options="options"
      @setSelectedOption="selectedOption = $event"
      @setText="keyword = $event"
      @search="search"
      @sendGA="handleSendGA"
    />
    <UIOthersList
      class="others-list"
      :links="otherLinks"
      eventCategory="header"
      @sendGA="handleSendGA"
    />
  </section>
</template>

<script>
import _ from 'lodash'

import UISearchBar from './UISearchBar.vue'
import UISearchBarDesktop from './UISearchBarDesktop.vue'
import UIOthersList from './UIOthersList.vue'

import { OTHER_LINKS } from '~/constants/index'

export default {
  name: 'ContainerSearchBar',
  components: {
    UISearchBar,
    UISearchBarDesktop,
    UIOthersList,
  },
  props: {
    sections: {
      type: Array,
      required: true,
      validator: (sections) => sections.every((section) => section.isFeatured),
    },
  },
  data() {
    return {
      defaultOption: { title: '全部類別' },
      selectedOption: {},
      keyword: '',
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
    search() {
      if (this.keyword === '') {
        return
      }

      const keyword = this.handleWhitespace(this.keyword)
      const { id } = this.selectedOption
      const query = id ? `?section=${id}` : ''
      this.$router.push(`/search/${keyword}${query}`)
    },
    handleWhitespace(str) {
      // 1. remove whitespace from both sides of a string
      // 2. remove whitespace from both sides of any comma
      // 3. replace whitespace bwtween two letters with a comma
      return str
        .trim()
        .replace(/\s*,\s*/g, ',')
        .replace(/\s+/g, ',')
    },
    handleSendGA(param = {}) {
      this.$ga.event(param)
    },
  },
}
</script>

<style lang="scss" scoped>
.search-bar-container {
  position: relative;
  z-index: 199;
  @include media-breakpoint-up(xl) {
    display: flex;
    align-items: center;
  }
}
.others-list {
  display: none;
  @include media-breakpoint-up(xl) {
    display: block;
  }
}
</style>
