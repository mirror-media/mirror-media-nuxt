<template>
  <div class="referendum">
    <div class="referendum__wrapper">
      <iframe src="/referendum" />
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.referendum {
  height: 544px;
  width: 100%;
  @include media-breakpoint-up(md) {
    height: 305px;
  }
  &__wrapper {
    position: absolute;
    left: 0;
    width: 100vw;
    padding: 0 10px;
    transform: translate(0, 10px);
    @include media-breakpoint-up(md) {
      padding: 0;
    }
    iframe {
      height: 524px;
      width: 100%;
      @include media-breakpoint-up(md) {
        height: 285px;
      }
    }
  }
}
</style>
