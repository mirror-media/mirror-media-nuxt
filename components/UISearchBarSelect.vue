<template>
  <div v-click-outside="hideOption" class="search-bar-select">
    <button type="button" class="displayed-field" @click="toggleOptionField">
      {{ selectedOption.title }}
    </button>
    <ul v-show="isOptionField" class="option-filed">
      <li
        v-for="({ title }, idx) in options"
        :key="title"
        :class="{ selected: selectedOptionIdx === idx }"
        @click="handleClickOption(idx)"
      >
        {{ title }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'UISearchBarSelect',
  props: {
    options: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isOptionField: false,
      selectedOptionIdx: 0,
    }
  },
  computed: {
    selectedOption() {
      return this.options[this.selectedOptionIdx]
    },
  },
  watch: {
    selectedOption: {
      handler(newSelectedOption) {
        this.$emit('setSelectedOption', newSelectedOption)
      },
      immediate: true,
    },
  },
  methods: {
    handleClickOption(idx) {
      this.selectOption(idx)
      this.hideOption()
    },
    selectOption(idx) {
      this.selectedOptionIdx = idx
    },
    toggleOptionField() {
      this.isOptionField = !this.isOptionField
    },
    hideOption() {
      this.isOptionField = false
    },
  },
}
</script>

<style lang="scss" scoped>
.search-bar-select {
  font-size: 16px;
  line-height: 1.15;
  position: relative;
}
.displayed-field {
  padding: 8px 12px;
  height: 34px;
  cursor: pointer;
  user-select: none;
  display: block;
  width: 100%;
  text-align: left;
  position: relative;
  background-color: #fff;
  color: #888;
  &::after {
    content: '';
    display: block;
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    border-color: #888 transparent transparent;
    border-style: solid;
    border-width: 6px 5px 0 5px;
  }
}
.option-filed {
  // display: none;
  color: #1b1b1b;
  position: absolute;
  top: 34px;
  left: 0;
  width: 100%;
  height: 308px;
  overflow-y: auto;
  background-color: #fff;
  box-shadow: 0 0 50px 0 rgba(0, 0, 0, 0.1);
  & li {
    padding: 8px 12px;
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &:hover {
      background-color: #f5f5f5;
    }
    &.selected {
      background-color: #074f77;
      color: #fff;
    }
  }
}
</style>
