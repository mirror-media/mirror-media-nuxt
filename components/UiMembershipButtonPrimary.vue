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
  &:hover {
    @include media-breakpoint-up(xl) {
      background: linear-gradient(
          0deg,
          rgba(29, 159, 184, 0.3),
          rgba(29, 159, 184, 0.3)
        ),
        #054f77;
    }
  }
  &:active {
    background: linear-gradient(
        0deg,
        rgba(29, 159, 184, 0.5),
        rgba(29, 159, 184, 0.5)
      ),
      #054f77;
  }
  &:disabled {
    background-color: #e3e3e3;
    color: rgba(0, 0, 0, 0.2);
    cursor: not-allowed;
    pointer-events: none;
  }
}
</style>
