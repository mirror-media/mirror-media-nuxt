<template>
  <div class="wrapper">
    <CarouselPc :polling="polling" />
    <CarouselMob :polling="polling" />
    <ElectionFooter :updatedAt="updatedAt" />
  </div>
</template>

<script>
import ElectionFooter from './components/election-footer.vue'
import CarouselPc from './components/carousel-pc.vue'
import CarouselMob from './components/carousel-mob.vue'

export default {
  name: 'ElectionMayor',

  components: {
    ElectionFooter,
    CarouselPc,
    CarouselMob,
  },

  props: {
    polling: {
      type: Array,
      default: () => {
        return []
      },
    },
    updatedAt: {
      type: String,
      default: () => {
        return ''
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f3f5f7;
  height: 358px;
  margin-bottom: 10px;
  @include media-breakpoint-up(md) {
    height: 209px;
  }
  @include media-breakpoint-up(xl) {
    height: 301px;
  }
}
</style>
