<template>
  <div class="wine-warning-wrapper">
    <div class="wine-warning-img" />
  </div>
</template>

<script>
export default {
  name: 'WineWarning',
}
</script>

<style lang="stylus" scoped>
.wine-warning
  &-wrapper
    width 100%
    height 10vh
    position fixed
    bottom 0
    z-index 999
    background-color #000
  &-img
    height 100%
    background-image url(/deprecated/topic-page/assets/mirrormedia/wine-warning--mobile.png)
    background-size contain
    background-repeat no-repeat
    background-position center
    @media (min-width 965px)
      background-image url(/deprecated/topic-page/assets/mirrormedia/wine-warning--desktop.png)
</style>
