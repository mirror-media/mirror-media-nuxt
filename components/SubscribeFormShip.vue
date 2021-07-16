<template>
  <div class="ship">
    <h2 class="subscribe-form__title">寄送方式</h2>

    <p class="ship__detail">
      因週刊派送屬一般投遞投遞非簽收件，如需簽收建議選擇以掛號寄送。
    </p>

    <div class="ship__choose">
      <UiSubscribeRadioInput
        v-model="shipPlanName"
        radioValue="一般配送"
        radioName="限時專送 NT$ 0 / 期"
      />
      <UiSubscribeRadioInput
        v-model="shipPlanName"
        radioValue="限時掛號"
        radioName="限時掛號 NT$ 20 / 期"
      />
    </div>
  </div>
</template>

<script>
import UiSubscribeRadioInput from '~/components/UiSubscribeRadioInput.vue'

export default {
  components: {
    UiSubscribeRadioInput,
  },
  props: {
    setShipPlan: {
      type: Function,
      isRequired: true,
      default: () => {},
    },
  },
  data() {
    return {
      shipPlanName: '限時專送',
    }
  },
  watch: {
    shipPlanName(val) {
      switch (val) {
        case '限時專送':
          this.setShipPlan({
            name: '限時專送',
            cost: 0,
          })
          break

        case '限時掛號':
          this.setShipPlan({
            name: '限時掛號',
            cost: 20,
          })
          break

        default:
          this.setShipPlan({
            name: '限時專送',
            cost: 0,
          })
          break
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.ship {
  font-size: 16px;
  line-height: 1.87;
  color: #000000a8;
  padding: 0 calc(25px - 8px);

  @include media-breakpoint-up(md) {
    padding: 0;
  }

  &__detail {
    margin-bottom: 20px;
    @include media-breakpoint-up(sm) {
      margin-bottom: 23px;
    }
  }

  &__choose {
    font-size: 18px;
    line-height: normal;
    &_item {
      margin-bottom: 21px;
      display: flex;
      align-items: center;
      input[type='radio'] {
        margin-right: 8px;
      }
    }
  }
}
</style>
