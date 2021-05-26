<template>
  <h1>
    <slot />
  </h1>
</template>

<style lang="scss" scoped>
h1 {
  font-family: source-han-serif-tc, 'Songti TC', serif;
  font-weight: bold;
  font-size: 30px;
  line-height: 150%;
  text-align: center;
  color: rgba(0, 0, 0, 0.87);
  @include media-breakpoint-up(md) {
    font-size: 40px;
  }
}
</style>
