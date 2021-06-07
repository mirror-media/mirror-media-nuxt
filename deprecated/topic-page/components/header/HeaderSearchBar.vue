<template>
  <section class="header-search-bar">
    <form action="" @submit.prevent="search" @focusout="search">
      <input v-model="keyword" type="search" :placeholder="'搜尋'" />
    </form>
    <button @click="closeSearchBar()">
      <img
        src="/deprecated/topic-page/assets/mirrormedia/icon/close.png"
        :alt="'關閉'"
      />
    </button>
  </section>
</template>
<script>
import { sendGaClickEvent } from '../../util/comm'

export default {
  name: 'HeaderSearchBar',
  data() {
    return {
      keyword: '',
    }
  },
  methods: {
    closeSearchBar() {
      this.$emit('closeSearchBar')
      sendGaClickEvent.call(this, 'header', 'search close')
    },
    search() {
      this.$emit('search', this.keyword)
      this.keyword = ''
    },
  },
}
</script>
<style lang="stylus" scoped>
.header-search-bar
  display flex
  align-items center
  position fixed
  top 0
  left 0
  right 0
  z-index 510
  width 100%
  height 70px
  padding 0 5%
  background-color rgba(255, 255, 255, .9)
  box-shadow 0 3px 2px 0 rgba(0,0,0,.1), 0 2px 0 0 #fff
  form
    flex 1
    height 30px
    margin-right 1em
  input
    width 100%
    height 100%
    padding 0
    font-size 1.5rem
    line-height 30px
    background-color transparent
    border none
  button
    width 30px
    height 30px
    padding 0
    background-color transparent
    border none
    img
      width 20px
      height 20px
      object-fit contain
      object-position center center
</style>
