<template>
  <section>
    <UISearchBar
      :options="options"
      @setSelectedOption="selectedOption = $event"
      @setText="keyword = $event"
      @search="search"
    />
  </section>
</template>

<script>
import UISearchBar from './UISearchBar.vue'

export default {
  name: 'ContainerSearchBar',
  components: {
    UISearchBar,
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
    }
  },
  computed: {
    options() {
      const sections = this.sections.filter(
        (section) => section.name !== 'videohub'
      )
      return [this.defaultOption, ...sections]
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
  },
}
</script>
