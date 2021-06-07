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
  padding: 8px 20px;
  font-size: 15px;
  color: #4a4a4a;
  border-radius: 4px;
  background-color: #f5f5f5;
}
</style>
