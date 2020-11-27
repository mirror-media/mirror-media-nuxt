<template>
  <div v-click-outside="hideOptionList" class="dropdown-wrapper">
    <div
      :class="[
        'active-item',
        { 'active-item--disable': state === 'disable' },
        { 'active-item--invalid': state === 'invalid' },
      ]"
      :style="{
        height: `${height}px`,
      }"
      @click="handleActiveItemClick"
    >
      <span
        :class="[
          'active-item__placeholder',
          { 'active-item__placeholder--black': !!selectedOption },
        ]"
        v-text="activeItemText"
      />
      <span class="active-item__triangle-icon" />
    </div>
    <ol
      v-show="shouldShowOptionList"
      class="dropdown-wrapper__option-list option-list"
      :style="{
        maxHeight: `${height * 4}px`,
        top: `${height}px`,
      }"
    >
      <li
        v-for="option in options"
        :key="option"
        class="option-list-item"
        :style="{
          height: `${height}px`,
        }"
        @click="handleOptionListItemClick(option)"
        v-text="option"
      />
    </ol>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: '請選擇',
    },
    options: {
      type: Array,
      required: true,
    },
    state: {
      type: String,
      default: 'normal',
    },
    height: {
      type: Number,
      default: 30,
    },
  },
  data() {
    return {
      shouldShowOptionList: false,
      selectedOption: '',
    }
  },
  computed: {
    activeItemText() {
      return this.selectedOption || this.placeholder
    },
  },
  methods: {
    handleActiveItemClick() {
      if (this.state === 'disable') {
        return
      }
      this.shouldShowOptionList = !this.shouldShowOptionList
    },
    handleOptionListItemClick(value) {
      this.selectedOption = value
      this.shouldShowOptionList = false
      this.$emit('change', value)
    },
    hideOptionList() {
      this.shouldShowOptionList = false
    },
  },
}
</script>

<style lang="scss" scoped>
.dropdown-wrapper {
  position: relative;
  &__option-list {
    position: absolute;
  }
}

.active-item {
  border: 1px solid #d8d8d8;
  padding: 0 10px;
  color: #888888;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  cursor: pointer;
  &--disable {
    color: #d8d8d8;
    cursor: not-allowed;
    outline: none;
    .active-item__triangle-icon {
      border-color: #d8d8d8 transparent transparent transparent;
    }
  }
  &--invalid {
    color: #d0021b;
    border: 1px solid #d0021b;
    .active-item__triangle-icon {
      border-color: #d0021b transparent transparent transparent;
    }
  }
  &__placeholder {
    &--black {
      color: #4a4a4a;
    }
  }
  &__triangle-icon {
    display: inline-block;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 10.4px 6px 0 6px;
    border-color: #c4c4c4 transparent transparent transparent;
    margin: 0 0 0 5px;
  }
}

.option-list {
  width: 100%;
  border: 1px solid #d8d8d8;
  border-top: none;
  overflow-y: scroll;
  background-color: white;
  z-index: 999;
}
.option-list-item {
  padding: 0 10px;
  display: flex;
  align-items: center;
  color: #4a4a4a;
  cursor: pointer;
  &:hover {
    background-color: #dae5f1;
  }
}
</style>
