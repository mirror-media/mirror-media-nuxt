<template>
  <div class="subscribe-cancel">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.subscribe-cancel {
  margin: 0 auto;
  font-size: 18px;
  line-height: 150%;
  @include media-breakpoint-up(sm) {
    width: 423px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    padding: 24px 24px 16px 24px;
  }
}
</style>
