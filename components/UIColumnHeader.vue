<template>
  <h2>{{ title }}</h2>
</template>

<script>
export default {
  name: 'UIColumnHeader',
  props: {
    title: {
      type: String,
      default: '',
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
h2 {
  font-size: 24px;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 0.5px;
  color: #356d9c;
  overflow: hidden;
  @include media-breakpoint-up(xl) {
    font-size: 20.8px;
    line-height: 1.15;
  }
  &::after {
    content: '';
    display: inline-block;
    vertical-align: middle;
    width: 100%;
    margin-right: -100%;
    margin-left: 10px;
    height: 5px;
    margin-bottom: 4px;
    background-color: #356d9c;
    @include media-breakpoint-up(xl) {
      content: none;
    }
  }
}
</style>
