<template>
  <div class="plan-card">
    <h6 class="plan-card__title">{{ title }}</h6>
    <p class="plan-card__detail">{{ detail }}</p>
    <p class="plan-card__original_price">{{ originalPrice }}</p>
    <p class="plan-card__new_price">{{ newPrice }}</p>
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
    detail: {
      type: String,
      isRequired: true,
      default: '',
    },
    originalPrice: {
      type: Number,
      isRequired: true,
      default: 3990,
    },
    newPrice: {
      type: Number,
      isRequired: true,
      default: 2880,
    },
  },
}
</script>

<style lang="scss" scoped>
.plan-card {
  width: 480px;
  height: 380px;
  background: #f5f5f5;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
