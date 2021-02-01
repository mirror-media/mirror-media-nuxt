<template>
  <div class="slideshow-button-prev">
    <SvgArrowPrev class="arrow" />
  </div>
</template>

<script>
import SvgArrowPrev from '~/assets/arrow-prev-slideshow.svg?inline'

export default {
  name: 'UiSlideshowButtonPrev',

  components: {
    SvgArrowPrev,
  },
}
</script>

<style lang="scss" scoped>
.slideshow-button-prev {
  width: 30px;
  height: 40px;
  background-color: rgba(245, 245, 245, 0.25);
  border-radius: 4px;
  position: absolute;
  top: 50%;
  left: 5px;
  transform: translateY(-50%);
  z-index: 9;
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;

  &:hover {
    background-color: #084f77;

    .arrow {
      fill: #fff;
    }
  }
}

.arrow {
  width: 15px;
  height: auto;
  transform: translateX(-1px);
}
</style>
