<template>
  <div class="choose-plan">
    <div class="choose-plan__wrapper">
      <div class="choose-plan__plan_container">
        <SubscribeChoosePlanCard
          v-for="plan in planList"
          :key="plan.id"
          :planUrl="plan.id + 1"
          :title="plan.title"
          :detail="plan.detail"
          :originalPrice="plan.originalPrice"
          :newPrice="plan.newPrice"
        />
      </div>

      <UiSubscribeInfo />
    </div>
  </div>
</template>

<script>
import SubscribeChoosePlanCard from '~/components/SubscribeChoosePlanCard.vue'
import UiSubscribeInfo from '~/components/UiSubscribeInfo.vue'
export default {
  components: {
    SubscribeChoosePlanCard,
    UiSubscribeInfo,
  },

  data() {
    return {
      planList: [
        {
          id: 0,
          title: '一年方案',
          detail: '訂購一年鏡週刊52期，加購5期',
          originalPrice: 3990,
          newPrice: 2880,
        },
        {
          id: 1,
          title: '二年方案',
          detail: '訂購二年鏡週刊104期，加購10期',
          originalPrice: 7800,
          newPrice: 5280,
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.choose-plan {
  background: white;
  padding: 10px 8px;

  @include media-breakpoint-up(sm) {
    padding: 49px 8px 47px;
  }

  &__wrapper {
    max-width: 990px;
    margin: auto;
  }

  &__plan_container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 32px;

    @include media-breakpoint-up(sm) {
      flex-direction: row;
    }
  }
}
</style>
