<template>
  <div v-click-outside="hideField" class="search-bar">
    <button
      type="button"
      class="search-icon"
      aria-label="search-icon"
      @click="toggleField"
    >
      <SvgSearchIcon />
    </button>

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
import SvgSearchIcon from '~/assets/icon_search_mobile.svg?inline'

export default {
  name: 'UiSearchBar',
  components: {
    UiSearchBarSelect,
    UiSearchBarInput,
    SvgSearchIcon,
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
$header-top-layer-w: 90%;
$header-top-layer-padding-x: math.div(100% - $header-top-layer-w, 2);
$search-icon-width: 18px;
$search-field-arrow-width: 11px;
$search-field-arrow-width-half: math.div($search-field-arrow-width, 2);

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
  width: $search-icon-width;
  height: 18px;
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
    right: calc(
      #{$header-top-layer-padding-x} + #{math.div(
          $search-icon-width - $search-field-arrow-width,
          2
        )}
    );
    border-color: transparent transparent #064f77;
    border-style: solid;
    border-width: 0 $search-field-arrow-width-half 12px
      $search-field-arrow-width-half;
  }
}
</style>
