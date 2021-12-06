<template>
  <div class="subscribe-magazine-entrance" @click="handleClick">
    鏡週刊<br v-if="!isViewportWidthUpMd && isMounted" />雜誌訂閱
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      isMounted: false,
    }
  },
  computed: {
    ...mapGetters({
      isViewportWidthUpMd: 'viewport/isViewportWidthUpMd',
    }),
  },
  mounted() {
    this.isMounted = true
    console.log(this.isViewportWidthUpMd)
  },
  methods: {
    handleClick() {
      this.$router.push('/papermag')
    },
  },
}
</script>

<style lang="scss" scoped>
.subscribe-magazine-entrance {
  padding: 4px 9px;
  font-weight: 500;
  font-size: 16px;
  line-height: 23px;
  color: #fbbc05;
  background: #054f77;
  margin: 0 5vw 0 0;
  text-align: center;
  cursor: pointer;
  @include media-breakpoint-up(md) {
    margin: 0 48px 0 0;
  }
  @include media-breakpoint-up(xl) {
    margin: 0 0 0 12px;
  }
}
</style>
