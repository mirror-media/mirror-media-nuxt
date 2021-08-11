<template>
  <div class="perchase-info">
    <div class="subscribe-form__title">訂單資訊</div>
    <div class="perchase-info__row">
      <span>{{ perchasedPlan[0].detail }}</span>
      <span>NT$ {{ perchasedPlan[0].newPrice }}</span>
    </div>
    <div class="perchase-info__row hint">
      <span>每月 $49 元・信用卡自動續扣</span>
    </div>

    <div class="perchase-info__devider" />

    <div class="perchase-info__row">
      <span>費用總計</span>
      <span>NT$ {{ perchasedPlan[0].newPrice }}</span>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    perchasedPlan: {
      type: Array,
      isRequired: true,
      default: () => {
        return [
          {
            id: 1,
            detail: '鏡週刊 Premium 會員 (月方案)',
            price: 99,
            newPrice: 49,
          },
        ]
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.perchase-info {
  padding: 27px 10px 24px;
  border-radius: 4px;
  background-color: #f5f5f5;

  @include media-breakpoint-up(sm) {
    padding: 22px 25px 24px;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    gap: 24px;

    * {
      min-width: 70px;
    }

    &.hint {
      font-size: 16px;
      line-height: 24px;
      color: rgba(0, 0, 0, 0.3);
      margin-bottom: 16px;
    }

    &:last-child {
      margin-bottom: 0;
    }

    @include media-breakpoint-up(sm) {
      font-size: 18px;
      line-height: 27px;
    }
  }

  &__devider {
    margin: 16px 0;
    border: 1px solid #00000080;
  }
}

.subscribe-form__title {
  font-size: 22px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #4a4a4a;
  margin-bottom: 24px;
  @include media-breakpoint-up(sm) {
    font-size: 24px;
  }
}
</style>
