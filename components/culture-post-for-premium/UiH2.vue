<template>
  <h2>
    <slot />
  </h2>
</template>

<style lang="scss" scoped>
h2 {
  font-family: source-han-serif-tc, 'Songti TC', serif;
  font-weight: bold;
  font-size: 26px;
  line-height: 150%;
  color: rgba(0, 0, 0, 0.87);
  @include media-breakpoint-up(md) {
    font-size: 32px;
  }
}
</style>
