<template>
  <div class="subscribe-megazine-page">
    <SubscribeStepProgress
      :currentStep="currentStep"
      :jumpToStep="jumpToStep"
    />
    <SubscribeChoosePlan v-if="currentStep === 1" :choosePlan="choosePlan" />
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
      choosedPlanId: 0,
    }
  },
  methods: {
    jumpToStep(step) {
      this.currentStep = step
    },
    choosePlan(choosedPlanId) {
      this.choosedPlanId = choosedPlanId
      this.currentStep++
    },
  },
}
</script>

<style lang="scss" scoped></style>
