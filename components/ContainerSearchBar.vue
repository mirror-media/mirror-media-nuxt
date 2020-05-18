<template>
  <section v-click-outside="hideField" class="search-bar">
    <button type="button" class="search" @click="toggleField" />
    <div v-show="isField" class="field">
      <UISearchBarSelect
        :options="options"
        @setSelectedOption="selectedOption = $event"
      />
      <UISearchBarInput
        class="search-bar-input"
        @setText="keyword = $event"
        @search="search"
      />
    </div>
  </section>
</template>

<script>
import UISearchBarSelect from './UISearchBarSelect.vue'
import UISearchBarInput from './UISearchBarInput.vue'

export default {
  name: 'ContainerSearchBar',
  components: {
    UISearchBarSelect,
    UISearchBarInput,
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
      isField: false,
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
    toggleField() {
      this.isField = !this.isField
    },
    hideField() {
      this.isField = false
    },
  },
}
</script>

<style lang="scss" scoped>
.search-bar {
  position: relative;
  z-index: 199;
  @include media-breakpoint-up(xl) {
    display: none;
  }
}
.search {
  display: block;
  width: 18px;
  height: 18px;
  background-image: url(~assets/icon_search_mobile.png);
  background-size: 18px;
  cursor: pointer;
  user-select: none;
}
.field {
  background-color: #064f77;
  width: 100%;
  padding: 22px 29px;
  position: absolute;
  top: 50px;
  left: 0;
  &::before {
    content: '';
    display: block;
    position: absolute;
    top: -12px;
    // (18 - 11) / 2
    left: 3.5px;
    border-color: transparent transparent #064f77;
    border-style: solid;
    border-width: 0 5.5px 12px 5.5px;
  }
}
.search-bar-input {
  margin-top: 20px;
}
</style>
