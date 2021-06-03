<template>
  <nav class="nav">
    <SearchInput
      class="nav__input"
      :placeholder="'請輸入關鍵字'"
      :input.sync="input"
      @enter="onSearchInputEnter"
    />
    <SearchSelect
      class="nav__select"
      :sections="sections"
      :currentOption.sync="currentOption"
    />
    <SearchButtonSubmit
      class="nav__button-submit"
      @click.native="onSearchButtonSubmit"
    />
  </nav>
</template>

<script>
import { get } from 'lodash'

import { sendGaClickEvent } from '../../util/comm'
import SearchInput from './SearchInput.vue'
import SearchSelect from './SearchSelect.vue'
import SearchButtonSubmit from './SearchButtonSubmit.vue'

export default {
  components: {
    SearchInput,
    SearchSelect,
    SearchButtonSubmit,
  },
  props: {
    sections: {
      type: Array,
      default() {
        return []
      },
      required: true,
    },
  },
  data() {
    return {
      // Value synced by child components
      input: '',
      currentOption: {},
    }
  },
  methods: {
    onSearchInputEnter() {
      this.search()
    },
    onSearchButtonSubmit() {
      sendGaClickEvent('header', 'search')
      this.search()
    },
    search() {
      if (this.input !== '') {
        const keyword = this.input.replace(/\s+/g, ',')
        const scope = get(this.currentOption, 'scope', '')
        const scopeId = get(this.currentOption, 'id', '')

        const query = scope !== '' ? `?${scope}=${scopeId}` : ''
        this.$router.push(`/search/${keyword}${query}`)
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
.nav
  display flex
  align-items center
  &__input
    width 246px
  &__select
    margin 0 0 0 4px
  &__button-submit
    margin 0 0 0 3px
</style>
