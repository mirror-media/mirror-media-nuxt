<template>
  <div class="subscribe-magazine-page">
    <SubscribeStepProgress :currentStep="1" />
    <SubscribeChoosePlan />
  </div>
</template>

<script>
import SubscribeStepProgress from '~/components/SubscribeStepProgress.vue'
import SubscribeChoosePlan from '~/components/SubscribeChoosePlan.vue'

export default {
  components: {
    SubscribeStepProgress,
    SubscribeChoosePlan,
  },
}
</script>

<style lang="scss" scoped>
.subscribe-magazine-page {
  position: relative;
}
</style>
