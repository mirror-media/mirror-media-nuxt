<template>
  <div class="skeleton">
    <div class="skeleton__line"></div>
    <div class="skeleton__line"></div>
    <div class="skeleton__line"></div>
  </div>
</template>

<style lang="scss" scoped>
.skeleton {
  margin: 32px 0;
  &__line {
    background: #d9d9d9;
    border-radius: 4px;
    height: 16px;
    margin: 16px 0;
    overflow: hidden;
    position: relative;
    &:last-child {
      width: calc(100% - 60%);
    }
    &::before {
      position: absolute;
      content: '';
      height: 100%;
      width: 100%;
      background-image: linear-gradient(
        to right,
        #d9d9d9 0%,
        rgba(0, 0, 0, 0.05) 20%,
        #d9d9d9 40%,
        #d9d9d9 100%
      );
      background-repeat: no-repeat;
      background-size: 450px 400px;
      animation: shimmer 2s linear infinite;
    }
  }
}
@keyframes shimmer {
  0% {
    background-position: -450px 0;
  }
  100% {
    background-position: 450px 0;
  }
}
</style>
