<template>
  <a>
    <slot />
  </a>
</template>

<style lang="scss" scoped>
a {
  color: #1d9fb8;
  border-bottom: 1px solid transparent;
  &:hover {
    border-bottom: 1px solid #1d9fb8;
  }
}
</style>
