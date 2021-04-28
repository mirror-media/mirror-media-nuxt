<template>
  <button class="button">
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
.button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 24px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  border-radius: 2px;
  font-size: 16px !important;
  color: rgba(0, 0, 0, 0.66) !important;
  outline: none;

  &:hover {
    border: 1px solid rgba(0, 0, 0, 0.66);
    color: rgba(0, 0, 0, 0.87) !important;
  }

  &:active {
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05)),
      #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.66);
    color: rgba(0, 0, 0, 0.87) !important;
  }
}
</style>
