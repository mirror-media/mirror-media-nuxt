<template>
  <a class="magazine-link">
    <slot />
  </a>
</template>

<style lang="scss" scoped>
.magazine-link {
  background: rgba(5, 79, 119, 1);
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
        rgba(29, 159, 184, 0.3),
        rgba(29, 159, 184, 0.3)
      ),
      #054f77;
  }
}
</style>
