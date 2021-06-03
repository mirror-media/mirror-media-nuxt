<template>
  <div class="receipt">
    <h2 class="subscribe-form__title">電子發票</h2>

    <p class="receipt__detail">
      雜誌每週三出刊，週五前可收到雜誌。欲更改收件地址，請於上班時間來電告知。
    </p>

    <div class="receipt__choose">
      <div class="receipt__choose_item">
        <input type="radio" value="捐贈" v-model="receiptPlan" />
        <span>捐贈</span>
      </div>

      <div class="receipt__choose_item">
        <input
          type="radio"
          value="二聯式發票（含載具）"
          v-model="receiptPlan"
        />
        <span>二聯式發票（含載具）</span>
      </div>

      <div class="receipt__choose_item">
        <input type="radio" value="三聯式發票" v-model="receiptPlan" />
        <span>三聯式發票</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    setReceiptPlan: {
      type: Function,
      isRequired: true,
    },
  },
  data() {
    return {
      receiptPlan: '捐贈',
    }
  },
  watch: {
    receiptPlan(val) {
      this.setReceiptPlan(val)
    },
  },
}
</script>

<style lang="scss" scoped>
.receipt {
  font-size: 15px;
  line-height: 1.87;
  color: #4a4a4a;
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
