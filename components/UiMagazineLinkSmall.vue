<template>
  <a class="magazine-link" :class="{ premium: isPremium }">
    <slot />
  </a>
</template>

<script>
export default {
  props: {
    isPremium: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
.magazine-link {
  padding: 8px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.3);
  color: rgba(0, 0, 0, 0.66);
  border-radius: 2px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    border: 1px solid rgba(0, 0, 0, 0.66);
    color: rgba(0, 0, 0, 0.87);
  }
  &:active {
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05)),
      #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.66);
    color: rgba(0, 0, 0, 0.87);
  }
}

.premium {
  border: 1px solid #054f77;
  color: #054f77;
  flex: 1;
  padding: 8px 0;
  &:hover {
    color: #054f77;
    background: linear-gradient(
        0deg,
        rgba(5, 79, 119, 0.05),
        rgba(5, 79, 119, 0.05)
      ),
      #ffffff;
  }
  &:active {
    color: #054f77;
    background: linear-gradient(
        0deg,
        rgba(5, 79, 119, 0.1),
        rgba(5, 79, 119, 0.1)
      ),
      #ffffff;
  }
  svg {
    margin: 0 4px 0 0;
  }
}
</style>
