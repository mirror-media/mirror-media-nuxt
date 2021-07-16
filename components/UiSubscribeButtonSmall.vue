<template>
  <div class="subscribe-button-small">
    {{ title }}
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      isRequired: true,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
.subscribe-button-small {
  user-select: none;
  cursor: pointer;
  padding: 8px 16px;
  font-size: 16px;
  color: #054f77;
  border-radius: 4px;
  background: #ffffff;
  border: 1px solid #054f77;
  border-radius: 2px;
  &:hover {
    background: linear-gradient(
        0deg,
        rgba(5, 79, 119, 0.05),
        rgba(5, 79, 119, 0.05)
      ),
      #ffffff;
  }
  &:active {
    background: linear-gradient(
        0deg,
        rgba(5, 79, 119, 0.1),
        rgba(5, 79, 119, 0.1)
      ),
      #ffffff;
  }
}
</style>
