<template>
  <div class="fail">
    <SubscribeFailWrapper :category="category" />
  </div>
</template>

<script>
import SubscribeFailWrapper from '~/components/SubscribeFailWrapper.vue'
export default {
  components: {
    SubscribeFailWrapper,
  },
  props: {
    category: {
      type: String,
      isRequired: true,
      default: 'default',
    },
  },
}
</script>

<style lang="scss" scoped>
.fail {
  font-size: 16px;
  line-height: 150%;
  color: rgba(0, 0, 0, 0.87);
  align-items: center;
  height: 50vh;
  max-width: 990px;
  margin: 0 auto;

  @include media-breakpoint-up(xl) {
    font-size: 18px;
  }
}
</style>
