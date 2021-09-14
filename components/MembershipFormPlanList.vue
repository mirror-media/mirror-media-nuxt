<template>
  <div class="membership-form">
    <div class="membership-form__title">
      <h2 class="membership-form__title">訂購項目</h2>
      <UiSubscribeButtonSmall
        title="更換方案"
        @click.native="() => $emit('back')"
      />
    </div>

    <UiMembershipList :perchasedPlan="perchasedPlan" :isPopUp="false" />
  </div>
</template>

<script>
import UiSubscribeButtonSmall from '~/components/UiSubscribeButtonSmall.vue'
import UiMembershipList from '~/components/UiMembershipList.vue'

export default {
  components: {
    UiMembershipList,
    UiSubscribeButtonSmall,
  },
  props: {
    perchasedPlan: {
      type: Array,
      isRequired: true,
      default: () => {
        return [
          {
            id: 1,
            detail: '鏡週刊 Premium 會員 (月方案)',
            price: '原價 NT$99',
            newPrice: 49,
          },
        ]
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.membership-form {
  font-size: 16px;

  &__title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;

    h2 {
      font-size: 22px;
      line-height: 34px;
      color: rgba(0, 0, 0, 0.87);

      @include media-breakpoint-up(sm) {
        font-size: 24px;
        line-height: 34px;
      }
    }

    .subscribe-button-small {
      height: 38px;
      line-height: 22px;
    }
  }
}
</style>
