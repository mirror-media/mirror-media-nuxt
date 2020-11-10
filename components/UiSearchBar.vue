<template>
  <div v-click-outside="hideField" class="search-bar">
    <button
      type="button"
      class="search-icon"
      aria-label="search-icon"
      @click="toggleField"
    />
    <div v-show="shouldShowField" class="field">
      <UiSearchBarSelect
        :options="options"
        @setSelectedOption="$emit('setSelectedOption', $event)"
      />
      <UiSearchBarInput
        class="search-bar__input"
        @setText="$emit('setText', $event)"
        @search="$emit('search')"
      />
    </div>
  </div>
</template>

<script>
import UiSearchBarSelect from './UiSearchBarSelect.vue'
import UiSearchBarInput from './UiSearchBarInput.vue'

export default {
  name: 'UiSearchBar',
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
  data() {
    return {
      shouldShowField: false,
    }
  },
  methods: {
    toggleField() {
      this.shouldShowField = !this.shouldShowField
    },
    hideField() {
      this.shouldShowField = false
    },
  },
}
</script>

<style lang="scss" scoped>
.search-bar {
  @include media-breakpoint-up(xl) {
    display: none;
  }
  &__input {
    margin-top: 20px;
  }
}
.search-icon {
  display: block;
  width: 18px;
  height: 18px;
  background-image: url(~assets/icon_search_mobile.png);
  background-size: 18px;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
  user-select: none;
}
.field {
  background-color: #064f77;
  width: 100%;
  padding: 22px 29px;
  position: absolute;
  top: 90px;
  left: 0;
  &::before {
    content: '';
    display: block;
    position: absolute;
    top: -12px;
    /**
     * 5% = (100% - 90%) / 2
     * 3.5 = (18 - 11) / 2
     */
    right: calc(5% + 3.5px);
    border-color: transparent transparent #064f77;
    border-style: solid;
    border-width: 0 5.5px 12px 5.5px;
  }
}
</style>
