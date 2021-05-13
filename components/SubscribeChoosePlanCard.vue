<template>
  <div class="plan-card">
    <h6 class="plan-card__title">{{ title }}</h6>
    <p class="plan-card__detail">{{ detail }}</p>
    <p class="plan-card__original_price">{{ originalPrice }}</p>
    <p class="plan-card__new_price">{{ newPrice }}</p>
    <SubscribeButton :title="`訂購${title}`" />
  </div>
</template>

<script>
import SubscribeButton from '~/components/SubscribeButton.vue'
export default {
  components: {
    SubscribeButton,
  },
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
  width: 100%;
  height: 290px;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
  @include media-breakpoint-up(sm) {
    max-width: 480px;
    height: 380px;
    margin-right: 30px;

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
