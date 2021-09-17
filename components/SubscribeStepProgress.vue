<template>
  <div class="step-progress">
    <div class="step-progress__wrapper">
      <SubscribeStepProgress
        :key="stepList[0].id"
        :step="stepList[0].step"
        :name="stepList[0].name"
        :isActive="currentStep >= stepList[0].step"
      />

      <SubscribeStepProgressDevider :isActive="currentStep >= 2" />

      <SubscribeStepProgress
        :key="stepList[1].id"
        :step="stepList[1].step"
        :name="stepList[1].name"
        :isActive="currentStep >= stepList[1].step"
      />

      <SubscribeStepProgressDevider :isActive="currentStep >= 3" />

      <SubscribeStepProgress
        :key="stepList[2].id"
        :step="stepList[2].step"
        :name="stepList[2].name"
        :isActive="currentStep >= stepList[2].step"
      />
    </div>
  </div>
</template>

<script>
import SubscribeStepProgress from '~/components/SubscribeStepProgressStep.vue'
import SubscribeStepProgressDevider from '~/components/SubscribeStepProgressDevider.vue'
export default {
  components: {
    SubscribeStepProgress,
    SubscribeStepProgressDevider,
  },
  props: {
    currentStep: {
      type: Number,
      isRequired: true,
      default: () => {
        return 1
      },
    },
    isUpgradeFromMonthToYear: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      normalStepList: [
        {
          id: 0,
          step: 1,
          name: '方案選擇',
        },
        {
          id: 1,
          step: 2,
          name: '確認訂購',
        },
        {
          id: 2,
          step: 3,
          name: '付款完成',
        },
      ],
      upgradeStepList: [
        {
          id: 0,
          step: 1,
          name: '方案選擇',
        },
        {
          id: 1,
          step: 2,
          name: '確認訂購',
        },
        {
          id: 2,
          step: 3,
          name: '付款完成',
        },
      ],
    }
  },
  computed: {
    stepList() {
      return this.isUpgradeFromMonthToYear
        ? this.normalStepList
        : this.upgradeStepList
    },
  },
}
</script>

<style lang="scss" scoped>
.step-progress {
  height: 82px;
  background: #054f77;

  @include media-breakpoint-up(sm) {
    height: 120px;
  }

  &__wrapper {
    max-width: 668px;
    margin: 0 auto;
    padding: 20px 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    @include media-breakpoint-up(sm) {
      padding: 40px 10px;
    }
  }
}
</style>
