<template>
  <div
    class="discount-wrapper"
    :class="{ 'discount-wrapper--red-font': discount.title === '符合續訂優惠' }"
  >
    <div>{{ discount.title }}</div>
    <div>{{ discount.content }}</div>
  </div>
</template>

<script>
export default {
  props: {
    discount: {
      type: Object,
      required: true,
      default: () => {
        return { title: '', content: '' }
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.discount-wrapper {
  margin-top: 8px;
  width: 100%;
  background: #f5f5f5;
  border-radius: 4px;
  padding: 14px 16px;
  font-size: 16px;
  line-height: 150%;
  color: #054f77;
  display: flex;
  justify-content: space-between;
  &--red-font {
    color: red;
  }
}
</style>
