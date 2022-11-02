<template>
  <h2>
    <slot />
  </h2>
</template>

<style lang="scss" scoped>
h2 {
  font-family: 'PingFang TC';
  font-weight: 500;
  font-size: 28px;
  line-height: 150%;
  color: #000000;
  @include media-breakpoint-up(md) {
    font-size: 36px;
  }
}
</style>
