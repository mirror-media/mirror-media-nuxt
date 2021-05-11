<template>
  <div class="subscribe-megazine-page">
    <SubscribeStepProgress :currentStep="currentStep" />
  </div>
</template>

<script>
import SubscribeStepProgress from '~/components/SubscribeStepProgress.vue'
export default {
  components: {
    SubscribeStepProgress,
  },
  data() {
    return {
      currentStep: 1,
    }
  },
}
</script>

<style lang="scss" scoped></style>
