<template>
  <section>
    <UiSearchBar @setText="keyword = $event" @search="search" />
    <UiSearchBarDesktop
      @setText="keyword = $event"
      @search="search"
      @sendGa="emitGa"
    />
  </section>
</template>

<script>
import UiSearchBar from './UiSearchBar.vue'
import UiSearchBarDesktop from './UiSearchBarDesktop.vue'

export default {
  name: 'UiSearchBarWrapper',
  components: {
    UiSearchBar,
    UiSearchBarDesktop,
  },
  data() {
    return {
      keyword: '',
    }
  },
  methods: {
    search() {
      if (this.keyword === '') {
        return
      }

      const searchPageUrl = this.$store?.getters?.['search-url/getSearchUrl']
      const keyword = this.handleWhitespace(this.keyword)

      location.assign(`${searchPageUrl}/${keyword}`)
    },
    handleWhitespace(str) {
      /**
       * 1. remove whitespace from both sides of a string
       * 2. remove whitespace from both sides of any comma
       * 3. replace whitespace bwtween two letters with a comma
       */
      return str
        .trim()
        .replace(/\s*,\s*/g, ',')
        .replace(/\s+/g, ',')
    },
    emitGa(param = {}) {
      this.$emit('sendGa', param)
    },
  },
}
</script>
