<template>
  <div class="perchase-info">
    <div class="subscribe-form__title">訂單資訊</div>
    <div class="perchase-info__row">
      <span>商品總計</span>
      <span>NT$ {{ price }}</span>
    </div>
    <div class="perchase-info__row">
      <span>運費</span>
      <span>NT$ {{ shipping }}</span>
    </div>

    <div class="perchase-info__devider" />

    <div class="perchase-info__row">
      <span>總計</span>
      <span>NT$ {{ total }}</span>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    price: {
      type: Number,
      isRequired: true,
      default: 0,
    },
    shipping: {
      type: Number,
      isRequired: true,
      default: 0,
    },
    total: {
      type: Number,
      isRequired: true,
      default: 0,
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
    margin-bottom: 14px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__devider {
    margin: 18px 0 19px;
    border: solid 1px #4a4a4a;
  }
}

.subscribe-form__title {
  font-size: 26px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #4a4a4a;
  margin-bottom: 24px;
}
</style>
