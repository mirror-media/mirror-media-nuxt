<template>
  <div v-click-outside="hideField" class="search-bar">
    <button type="button" class="search-icon" @click="toggleField" />
    <div v-show="isField" class="field">
      <UISearchBarSelect
        :options="options"
        @setSelectedOption="$emit('setSelectedOption', $event)"
      />
      <UISearchBarInput
        class="search-bar__input"
        @setText="$emit('setText', $event)"
        @search="$emit('search')"
      />
    </div>
  </div>
</template>

<script>
import UISearchBarSelect from './UISearchBarSelect.vue'
import UISearchBarInput from './UISearchBarInput.vue'

export default {
  name: 'UISearchBar',
  components: {
    UISearchBarSelect,
    UISearchBarInput,
  },
  props: {
    options: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isField: false,
    }
  },
  methods: {
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
</style>
