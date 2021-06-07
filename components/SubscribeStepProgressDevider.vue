<template>
  <div class="step-devider" :style="active"></div>
</template>

<script>
export default {
  props: {
    isActive: {
      type: Boolean,
      isRequired: true,
      default: () => {
        return false
      },
    },
  },
  computed: {
    active() {
      if (this.isActive) {
      }
      return this.isActive
        ? { background: `#ffffff` }
        : { background: `#9B9B9B` }
    },
  },
}
</script>

<style lang="scss" scoped>
.step-devider {
  height: 3px;
  // border-top: 3px solid #ffffff;
  background: white;
  flex: 1;
  flex-shrink: 1;
  margin: 0 16px;

  @include media-breakpoint-up(sm) {
    margin: 0 20px;
  }
}
</style>
