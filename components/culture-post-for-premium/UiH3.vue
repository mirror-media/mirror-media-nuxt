<template>
  <h2>
    <slot />
  </h2>
</template>

<style lang="scss" scoped>
h2 {
  font-family: 'PingFang TC';
  font-weight: 400;
  font-size: 24px;
  line-height: 150%;
  color: #555555;
  @include media-breakpoint-up(md) {
    font-size: 30px;
  }
}
</style>
