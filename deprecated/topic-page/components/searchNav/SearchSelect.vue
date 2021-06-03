<template>
  <div v-click-outside="hideOptionList" class="select-wrapper">
    <button class="select-wrapper__button button" @click="toggleOptionList">
      <p class="button__text">
        {{ getOptionTitle(currentOption) }}
      </p>
      <div class="button__triangle" />
    </button>
    <ul v-show="showOptionList" class="select-wrapper__option-list option-list">
      <li
        v-for="(option, i) in options"
        :key="i"
        :class="[
          'option-list__list-item',
          { 'option-list__list-item--blue': isOptionCurrent(option) },
        ]"
        @click="clickOption(option)"
      >
        {{ getOptionTitle(option) }}
      </li>
    </ul>
  </div>
</template>

<script>
import { get, flatten, concat } from 'lodash'

export default {
  directives: {
    'click-outside': {
      bind(el, binding, vnode) {
        el.clickOutsideEvent = function (event) {
          if (!(el === event.target || el.contains(event.target))) {
            vnode.context[binding.expression](event)
          }
        }
        document.body.addEventListener('click', el.clickOutsideEvent)
      },
      unbind(el) {
        document.body.removeEventListener('click', el.clickOutsideEvent)
      },
    },
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
    const defaultOption = { scope: '', id: '', name: 'all', title: '全部類別' }
    return {
      showOptionList: false,
      defaultOption,
      filterOutSections: ['videohub'],
      filterOutCategories: [],
      currentOption: defaultOption,
    }
  },
  computed: {
    options() {
      const sections = this.sections
        .map((section) => this.mapItems(section))
        .filter((section) => !this.filterOutSections.includes(section.name))
      const categories = flatten(
        this.sections.map((section) =>
          get(section, 'categories', []).map((category) =>
            this.mapItems(category, 'category')
          )
        )
      ).filter((category) => !this.filterOutCategories.includes(category.name))
      return concat(this.defaultOption, sections, categories)
    },
  },
  watch: {
    currentOption: {
      handler() {
        this.$emit('update:currentOption', this.currentOption)
      },
      immediate: true,
    },
  },
  methods: {
    toggleOptionList() {
      this.showOptionList = !this.showOptionList
    },
    hideOptionList() {
      this.showOptionList = false
    },

    mapItems({ id = '', name = '', title = '' }, scope = 'section') {
      return { scope, id, name, title }
    },

    getOptionTitle(option) {
      return get(option, 'title', '')
    },
    getOptionId(option) {
      return get(option, 'id', '')
    },

    clickOption(option) {
      this.$set(this, 'currentOption', option)
      this.hideOptionList()
    },

    isOptionCurrent(option) {
      return this.getOptionId(option) === this.getOptionId(this.currentOption)
    },
  },
}
</script>

<style lang="stylus" scoped>
.select-wrapper
  height 34px
  background-color white
  position relative
  &__button
    min-width 100px
    height 100%
    background-color transparent
    border none
    &:focus
      outline none
  &__option-list
    position absolute
    top 34px
    left 0
    width 100%

.button
  display flex
  justify-content space-between
  align-items center
  font-size 14px
  color #888888
  background-color white
  padding 0 12px
  &__text
    margin 0
  &__triangle
    width 0
    height 0
    border-style solid
    border-width 6px 5px 0 5px
    border-color #888888 transparent transparent transparent

.option-list
  margin 0
  padding 0
  list-style none
  z-index 10000
  background-color white
  box-shadow 0 0 50px 0 rgba(0, 0, 0, 0.1)
  height calc(28px * 11)
  overflow-y scroll
  &__list-item
    height 28px
    padding 7px 12px
    background-color white
    font-size 14px
    color black
    cursor pointer
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
    &:hover
      background-color #f5f5f5
    &--blue
      background-color #074f77
      color white
      &:hover
        background-color #074f77
</style>
