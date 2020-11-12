<template>
  <div class="wine-warning">
    <picture>
      <source
        type="image/png"
        media="(min-width: 992px)"
        srcset="~/assets/wine-warning-lg.png"
      />
      <img src="~/assets/wine-warning.png" alt="飲酒警示" />
    </picture>
  </div>
</template>

<script>
export default {
  name: 'UiWineWarning',
}
</script>

<style lang="scss" scoped>
.wine-warning {
  width: 100%;
  height: 10vh;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 1009;
  background-color: #000;
}

img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
