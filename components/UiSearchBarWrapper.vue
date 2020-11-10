<template>
  <section>
    <UiSearchBar
      :options="options"
      @setSelectedOption="selectedOption = $event"
      @setText="keyword = $event"
      @search="search"
    />
    <UiSearchBarDesktop
      :options="options"
      @setSelectedOption="selectedOption = $event"
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
  props: {
    options: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      selectedOption: {},
      keyword: '',
    }
  },
  methods: {
    search() {
      if (this.keyword === '') {
        return
      }

      const keyword = this.handleWhitespace(this.keyword)
      const { id } = this.selectedOption
      const query = id ? `?section=${id}` : ''

      // this.$router.push(`/search/${keyword}${query}`)
      location.assign(`/search/${keyword}${query}`)
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
