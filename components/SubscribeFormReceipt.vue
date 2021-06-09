<template>
  <div class="receipt">
    <h2 class="subscribe-form__title">電子發票</h2>

    <p class="receipt__detail">
      雜誌每週三出刊，週五前可收到雜誌。欲更改收件地址，請於上班時間來電告知。
    </p>

    <div class="receipt__choose">
      <div class="receipt__choose_item">
        <div class="receipt__choose_item_input">
          <input v-model="receiptPlan" type="radio" value="捐贈" />
          <span class="radio">捐贈</span>
        </div>

        <div v-if="receiptPlan === '捐贈'" class="receipt__choose_item_detail">
          <div class="receipt__choose_item_input">
            <select v-model="donateOrganization">
              <option>財團法人伊甸社會福利基金會</option>
              <option>財團法人中華民國兒童福利聯盟文教基金會</option>
              <option>財團法人私立脊髓損傷潛能發展中心</option>
            </select>
          </div>
        </div>
      </div>

      <div class="receipt__choose_item">
        <div class="receipt__choose_item_input">
          <input
            v-model="receiptPlan"
            type="radio"
            value="二聯式發票（含載具）"
          />
          <span class="radio">二聯式發票（含載具）</span>
        </div>

        <div
          v-if="receiptPlan === '二聯式發票（含載具）'"
          class="receipt__choose_item_detail"
        >
          <div class="receipt__choose_item_input">
            <select v-model="carrierType">
              <option value="mail">email載具</option>
              <option value="手機條碼">手機條碼</option>
              <option value="自然人憑證">自然人憑證</option>
            </select>
          </div>

          <div class="receipt__choose_item_input">
            <input type="text" :placeholder="carrierNumberPlaceHolder" />
          </div>
        </div>
      </div>

      <div class="receipt__choose_item">
        <div class="receipt__choose_item_input">
          <input v-model="receiptPlan" type="radio" value="三聯式發票" />
          <span class="radio">三聯式發票</span>
        </div>

        <div
          v-if="receiptPlan === '三聯式發票'"
          class="receipt__choose_item_detail"
        >
          <div class="receipt__choose_item_input">
            <input type="text" placeholder="抬頭" />
          </div>

          <div class="receipt__choose_item_input">
            <input type="text" placeholder="統一編號" />
          </div>
        </div>
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
      default: () => {},
    },
  },
  data() {
    return {
      receiptPlan: '捐贈',
      donateOrganization: '財團法人伊甸社會福利基金會',
      carrierType: 'mail',
      carrierNumber: '',
      carrierTitle: '',
      carrierUbn: '',
    }
  },

  watch: {
    receiptPlan(val) {
      this.setReceiptPlan(val)
    },
  },
  computed: {
    carrierNumberPlaceHolder() {
      let placeholder = ''
      switch (this.carrierType) {
        case 'mail':
          placeholder = 'example@gmail.com'
          break

        case '手機條碼':
          placeholder = '斜線字元 /，後接 7 個大寫英數字或特殊符號'
          break

        case '自然人憑證':
          placeholder = '2 個大寫英文字元，後接 14 個數字'
          break
      }

      return placeholder
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

      &_input {
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        input[type='radio'] {
          margin-right: 8px;
        }
      }

      &_detail {
        margin-left: 30px;
      }
    }
  }
}
</style>
