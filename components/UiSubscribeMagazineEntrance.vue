<template>
  <div class="subscribe-magazine-entrance" @click="handleClick">
    訂閱<br class="subscribe-magazine-entrance__br" />紙本雜誌
  </div>
</template>

<script>
export default {
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
  font-size: 12px;
  line-height: 17px;
  color: #fbbc05;
  background: #054f77;
  margin: 0 5vw 0 0;
  text-align: center;
  cursor: pointer;
  margin-left: 20px;
  @include media-breakpoint-up(md) {
    font-size: 16px;
    line-height: 23px;
    margin: 0 48px 0 0;
  }
  @include media-breakpoint-up(xl) {
    margin: 0 0 0 12px;
  }
  &__br {
    display: inline;
    @include media-breakpoint-up(md) {
      display: none;
    }
  }
}
</style>
