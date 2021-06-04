<template>
  <div v-click-outside="hideNav" class="nav-wrapper">
    <button class="nav-wrapper__button button" @click="toggleNav">
      <img
        class="button__img"
        src="/deprecated/topic-page/assets/mirrormedia/icon/icon_search_mobile.png"
        alt=""
      />
    </button>
    <nav
      v-show="isNavShow"
      :class="[
        'nav-wrapper__nav',
        { 'nav-wrapper__nav--offset': isScrolled },
        'nav',
      ]"
    >
      <div
        :class="['nav__triangle', { 'nav__triangle--offset': isScrolled }]"
      />
      <SearchSelect
        class="nav__select"
        :sections="sections"
        :currentOption.sync="currentOption"
      />
      <SearchInput
        class="nav__input"
        :placeholder="'請輸入關鍵字'"
        :input.sync="input"
        @enter="onSearchInputEnter"
      />
    </nav>
  </div>
</template>

<script>
import { get } from 'lodash'

import SearchInput from './SearchInput.vue'
import SearchSelect from './SearchSelect.vue'

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
  components: {
    SearchInput,
    SearchSelect,
  },
  props: {
    sections: {
      type: Array,
      default() {
        return []
      },
      required: true,
    },
    isScrolled: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  data() {
    return {
      // Value synced by child components
      input: '',
      currentOption: {},

      isNavShow: false,
    }
  },
  methods: {
    onSearchInputEnter() {
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

    toggleNav() {
      this.isNavShow = !this.isNavShow
    },
    hideNav() {
      this.isNavShow = false
    },
  },
}
</script>

<style lang="stylus" scoped>
.nav-wrapper
  position relative
  &__nav
    position absolute
    top 50px
    right -5vw
    width 100vw
    &--offset
      position fixed
      top 50px
      right 0

.button
  border none
  background-color transparent
  width 18px
  height 18px
  cursor pointer
  padding 0
  &:focus
    outline none
  &__img
    width 100%
    height 100%

.nav
  display flex
  flex-direction column
  align-items center
  background-color #064f77
  padding 22px 29px
  z-index 10000
  &__triangle
    position absolute
    right calc(5vw + 5.5px)
    top -12px
    width 0
    height 0
    border-style solid
    border-width 0 5.5px 12px 5.5px
    border-color transparent transparent #064f77 transparent
    &--offset
      right calc(5vw + 5.5px + 90px)
  &__select
    width 100%
  &__input
    margin 20px 0 0 0
    width 100%
</style>
