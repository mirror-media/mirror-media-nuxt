<template>
  <figcaption>
    <slot />
  </figcaption>
</template>

<style lang="scss" scoped>
figcaption {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 12px 0 0 0;
  font-size: 14px;
  line-height: 180%;
  text-align: justify;
  color: rgba(0, 0, 0, 0.5);
}
</style>
