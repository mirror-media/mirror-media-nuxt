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
  background-color: #1d9fb8;
  color: white;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    @include media-breakpoint-up(xl) {
      background: linear-gradient(
          0deg,
          rgba(5, 79, 119, 0.3),
          rgba(5, 79, 119, 0.3)
        ),
        #1d9fb8;
    }
  }
  &:active {
    background: linear-gradient(
        0deg,
        rgba(5, 79, 119, 0.5),
        rgba(5, 79, 119, 0.5)
      ),
      #1d9fb8;
  }
  &:disabled {
    background-color: #e3e3e3;
    color: rgba(0, 0, 0, 0.2);
    cursor: not-allowed;
    pointer-events: none;
  }
}
</style>
