<template>
  <a class="magazine-link">
    <slot />
  </a>
</template>

<style lang="scss" scoped>
.magazine-link {
  background: #1d9fb8;
  border-radius: 2px;
  color: white;
  font-size: 18px;
  display: flex;
  width: 100%;
  height: 48px;
  justify-content: center;
  align-items: center;
  &:hover,
  &:active {
    background: linear-gradient(
        0deg,
        rgba(5, 79, 119, 0.5),
        rgba(5, 79, 119, 0.5)
      ),
      #1d9fb8;
  }
}
</style>
