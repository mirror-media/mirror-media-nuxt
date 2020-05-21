<template>
  <section class="search-bar-wrapper">
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
      @sendGA="emitGA"
    />
    <UIOthersList
      class="others-list"
      :links="otherLinks"
      eventCategory="header"
      @sendGA="emitGA"
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
  name: 'UISearchBarWrapper',
  components: {
    UISearchBar,
    UISearchBarDesktop,
    UIOthersList,
  },
  props: {
    options: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
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
    emitGA(param = {}) {
      this.$emit('sendGA', param)
    },
  },
}
</script>

<style lang="scss" scoped>
.search-bar-wrapper {
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
