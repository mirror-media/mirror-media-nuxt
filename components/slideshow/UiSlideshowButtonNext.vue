<template>
  <div class="slideshow-button-next">
    <SvgArrowNext class="arrow" />
  </div>
</template>

<script>
import SvgArrowNext from '~/assets/arrow-next-slideshow.svg?inline'

export default {
  name: 'UiSlideshowButtonPrev',

  components: {
    SvgArrowNext,
  },
}
</script>

<style lang="scss" scoped>
.slideshow-button-next {
  width: 30px;
  height: 40px;
  background-color: rgba(245, 245, 245, 0.25);
  border-radius: 4px;
  position: absolute;
  top: 50%;
  right: 5px;
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
  transform: translateX(1px);
}
</style>
