<template>
  <div class="order-info">YOYO</div>
</template>

<script>
export default {
  props: {
    orderInfo: {
      type: Object,
      isRequired: true,
      default: () => {
        return {}
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.order-info {
  position: relative;
  padding: 23px 17px;
  border-radius: 4px;
  background-color: #f5f5f5;
  min-height: 50vh;

  @include media-breakpoint-up(sm) {
    padding: 22px 25px;
  }
}
</style>
