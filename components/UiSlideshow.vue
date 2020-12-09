<template>
  <!--
    this slideshow is for SSR: https://github.com/surmon-china/surmon-china.github.io/tree/source/projects/vue-awesome-swiper/nuxt

    為何不用 Swiper 6：https://github.com/surmon-china/vue-awesome-swiper/issues/680#issuecomment-655928225
  -->
  <div v-swiper="swiperOptions" class="swiper">
    <div class="swiper-wrapper">
      <slot>
        <!-- 記得要為每個 slide 加上 class 名 "swiper-slide"，這樣 slide 才能吃到 Swiper 的預設樣式 -->
      </slot>
    </div>

    <!-- Doc: https://swiperjs.com/api/#pagination -->
    <slot name="pagination">
      <!-- 若要讓 pagination 吃到 Swiper 的預設樣式，class 名需取為 "swiper-pagination" -->
    </slot>

    <!-- Doc: https://swiperjs.com/api/#navigation -->
    <slot name="btnPrev">
      <!-- 若要讓 btnPrev 吃到 Swiper 的預設樣式，class 名需取為 "swiper-button-prev" -->
    </slot>
    <slot name="btnNext">
      <!-- 若要讓 btnNext 吃到 Swiper 的預設樣式，class 名需取為 "swiper-button-next" -->
    </slot>
  </div>
</template>

<script>
export default {
  name: 'UiSlideshow',
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      swiperOptions: {
        loop: true,
        speed: 1000,
        centeredSlides: true,
        ...this.options,
      },
    }
  },
}
</script>

<style lang="scss" scoped>
.swiper {
  position: relative;
  overflow: hidden;
}
</style>
