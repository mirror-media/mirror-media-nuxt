<template>
  <div class="search-bar-desktop">
    <UiSearchBarInput
      class="search-bar-desktop__input"
      @setText="$emit('setText', $event)"
      @search="emitSearch"
    />
    <UiSearchBarSelect
      class="search-bar-desktop__select"
      :options="options"
      @setSelectedOption="$emit('setSelectedOption', $event)"
    />
    <button type="button" class="search-icon" @click="handleClickSearchIcon" />
  </div>
</template>

<script>
import UiSearchBarSelect from './UiSearchBarSelect.vue'
import UiSearchBarInput from './UiSearchBarInput.vue'

export default {
  name: 'UiSearchBarDesktop',
  components: {
    UiSearchBarSelect,
    UiSearchBarInput,
  },
  props: {
    options: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  methods: {
    emitSearch() {
      this.$emit('search')
    },
    handleClickSearchIcon() {
      this.emitSearch()
      this.emitGa('search')
    },
    emitGa(eventLabel) {
      this.$emit('sendGa', {
        eventCategory: 'header',
        eventAction: 'click',
        eventLabel,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.search-bar-desktop {
  display: none;
  @include media-breakpoint-up(xl) {
    display: flex;
  }
  &__input {
    font-size: 14px;
    width: 246px;
  }
  &__select {
    font-size: 14px;
    width: 100px;
    margin-left: 4px;
  }
}
.search-icon {
  display: block;
  width: 40px;
  height: 34px;
  background-size: 15px;
  cursor: pointer;
  user-select: none;
  background-image: url(~assets/icon_search_web.png);
  background-color: #888;
  background-position: center;
  background-repeat: no-repeat;
  margin-left: 4px;
  transition: background-color 0.15s ease-out;
  &:hover {
    background-color: #074f77;
  }
}
</style>
