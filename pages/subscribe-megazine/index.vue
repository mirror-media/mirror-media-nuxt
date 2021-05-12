<template>
  <div class="subscribe-megazine-page">
    <SubscribeStepProgress :currentStep="currentStep" />
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
  data() {
    return {
      currentStep: 1,
    }
  },
}
</script>

<style lang="scss" scoped></style>
