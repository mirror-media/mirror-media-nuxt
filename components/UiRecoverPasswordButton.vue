<template>
  <button class="button">
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
.button {
  width: 100%;
  height: 48px;
  border-radius: 2px;
  background-color: #054f77;
  color: white;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.disable {
  background-color: #e3e3e3;
  color: rgba(0, 0, 0, 0.2);
  cursor: not-allowed;
  pointer-events: none;
}
</style>
