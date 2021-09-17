<template>
  <div class="dots-wrapper">
    <span v-for="dot in 3" :key="dot" class="dot" :class="{ dark: isDark }" />
  </div>
</template>

<script>
export default {
  props: {
    isDark: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
@keyframes lightUp {
  from {
    filter: opacity(0%);
  }
  50% {
    filter: opacity(100%);
  }
  to {
    filter: opacity(0%);
  }
}
.dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  filter: opacity(0%);
  animation: lightUp 1.5s ease-in-out infinite;
  & + & {
    margin: 0 0 0 8px;
  }
  @for $i from 1 through 3 {
    &:nth-child(#{$i}) {
      animation-delay: #{($i - 1) * 0.25}s;
    }
  }

  &.dark {
    background: #d0021b !important;
  }
}
</style>
