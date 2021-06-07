<template>
  <div class="credit-card">credit card section(TODO)</div>
</template>

<script>
export default {
  props: {
    acceptPermission: {
      type: Boolean,
      isRequired: true,
      default: false,
    },
    setAcceptPermission: {
      type: Function,
      isRequired: true,
      default: () => {},
    },
  },
  components: {},
}
</script>

<style lang="scss" scoped>
.credit {
  position: relative;
}
</style>
