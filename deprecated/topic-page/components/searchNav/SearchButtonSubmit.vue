<template>
  <button class="button">
    <img
      class="button__img"
      src="/assets/mirrormedia/icon/icon_search_web.png"
      alt=""
    />
  </button>
</template>

<style lang="stylus" scoped>
.button
  width 40px
  height 34px
  border none
  display flex
  justify-content center
  align-items center
  background-color #888888
  transition background-color .25s ease-out
  &:focus
    outline none
  &:hover
    background-color #074f77
  &__img
    width 15px
</style>
