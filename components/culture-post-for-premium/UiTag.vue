<template>
  <a>
    <slot />
  </a>
</template>

<style lang="scss" scoped>
a {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 4px 8px;
  border: 1px solid #054f77;
  border-radius: 2px;
  font-size: 14px;
  line-height: 21px;
  color: #054f77;
  &:hover,
  &:active {
    background: rgba(5, 79, 119, 0.05);
  }
}
</style>
