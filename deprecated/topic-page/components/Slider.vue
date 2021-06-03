<template>
  <div :ref="uuid" v-swiper:[uuid]="swiperOption" class="swiper-container">
    <slot name="swiper-out-of-wrapper" />
    <div class="swiper-wrapper">
      <!-- remember add "swiper-slide" class name to each slot components -->
      <slot />
    </div>
    <div
      v-if="showSwiperPagination"
      :class="`${uuid}-swiper-pagination`"
      class="swiper-pagination"
    />
    <div
      v-if="showSwiperButton"
      :class="`${uuid}-swiper-button-prev`"
      class="swiper-button-prev"
    />
    <div
      v-if="showSwiperButton"
      :class="`${uuid}-swiper-button-next`"
      class="swiper-button-next"
    />
  </div>
</template>
<script>
import uuidv4 from 'uuid/v4'
import Vue from 'vue'

if (process.browser) {
  const VueAwesomeSwiper = require('vue-awesome-swiper/dist/ssr')
  Vue.use(VueAwesomeSwiper)
}

export default {
  name: 'Slider',
  props: {
    autoplay: {
      type: [Boolean, Object],
      default() {
        return {
          delay: 5000,
          disableOnInteraction: false,
        }
      },
    },
    initialSlide: {
      type: Number,
      default: 0,
    },
    loop: {
      type: Boolean,
      default: true,
    },
    showSwiperPagination: {
      type: Boolean,
      default: true,
    },
    showSwiperButton: {
      type: Boolean,
      default: true,
    },
    slidesPerView: {
      type: [Number, String],
      default: 'auto',
    },
    speed: {
      type: Number,
      default: 1000,
    },
  },
  data() {
    return {
      uuid: uuidv4(),
      swiperOption: {
        initialSlide: this.initialSlide,
        loop: this.loop,
        slidesPerView: this.slidesPerView,
        watchSlidesVisibility: true,
        centeredSlides: true,
        spaceBetween: 0,
        speed: this.speed,
        autoplay: this.autoplay,
        pagination: {
          el: '.swiper-pagination',
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      },
    }
  },
}
</script>

<!--<style src="swiper/dist/css/swiper.css" scoped></style>-->

<style lang="stylus" scoped>

.swiper-container
  clear both
  &--article
    >>> .swiper-button-prev, >>> .swiper-button-next
      width 30px
      height 40px
      margin-top -50px
      background-color rgba(245, 245, 245, .25)
      background-size 15px auto
      background-position 45% 50%
      background-repeat no-repeat
      border-radius 4px
      &:hover
        background-color #064f77
    >>> .swiper-button-prev
      left 5px
      background-image url(/assets/mirrormedia/icon/arrow-slideshow-blue-left.png)
      &:hover
        background-image url(/assets/mirrormedia/icon/arrow-slideshow-white-left.png)
    >>> .swiper-button-next
      right 5px
      background-image url(/assets/mirrormedia/icon/arrow-slideshow-blue-right.png)
      &:hover
        background-image url(/assets/mirrormedia/icon/arrow-slideshow-white-right.png)
.swiper-slide
  box-sizing border-box
  display flex
  flex-direction column
  justify-content center
  align-items center
  // height auto
  > img
    width 100%
    height 100%
    object-fit contain
    object-position center center
.swiper-pagination
  >>> .swiper-pagination-bullet
    display inline-block
    width 8px
    height 8px
    background-color #b5b5b5
    border-radius 8px
    transition background-color 0.5s ease
    & + .swiper-pagination-bullet
      margin-left 10px
  >>> .swiper-pagination-bullet-active
    background-color #fff

@media (min-width 1200px)
  .swiper-container
    &--article
      >>> .swiper-button-prev, >>> .swiper-button-next
        width 60px
        height 80px
        margin-top -60px
        background-size 28px auto
      >>> .swiper-button-prev
        left 0
      >>> .swiper-button-next
        right 0
</style>
