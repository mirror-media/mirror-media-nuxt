<template>
  <div class="receipt">
    <h2 class="subscribe-form__title">電子發票</h2>

    <p class="receipt__detail">
      雜誌每週三出刊，週五前可收到雜誌。欲更改收件地址，請於上班時間來電告知。
    </p>

    <div class="receipt__choose">
      <div class="receipt__choose_item">
        <UiSubscribeRadioInput
          v-model="receiptPlan"
          radioValue="捐贈"
          radioName="捐贈"
        />

        <div v-if="receiptPlan === '捐贈'" class="receipt__choose_item_detail">
          <UiSubscribeSelect
            v-model="donateOrganization"
            :optionList="donateOrganizationList"
          />
        </div>
      </div>

      <div class="receipt__choose_item">
        <UiSubscribeRadioInput
          v-model="receiptPlan"
          radioValue="二聯式發票（含載具）"
          radioName="二聯式發票（含載具）"
        />

        <div
          v-if="receiptPlan === '二聯式發票（含載具）'"
          class="receipt__choose_item_detail"
        >
          <UiSubscribeSelect
            v-model="carrierType"
            :optionList="carrierTypeList"
          />

          <UiValidationInput
            :validionOn="true"
            v-model="carrierNumber"
            :placeholder="carrierNumberPlaceHolder"
          />
        </div>
      </div>

      <div class="receipt__choose_item">
        <UiSubscribeRadioInput
          v-model="receiptPlan"
          radioValue="三聯式發票"
          radioName="三聯式發票"
        />

        <div
          v-if="receiptPlan === '三聯式發票'"
          class="receipt__choose_item_detail"
        >
          <UiValidationInput
            :validionOn="true"
            v-model="carrierTitle"
            placeholder="抬頭"
          />

          <UiValidationInput
            :validionOn="true"
            v-model="carrierUbn"
            placeholder="統一編號"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UiValidationInput from '~/components/UiValidationInput.vue'
import UiSubscribeSelect from '~/components/UiSubscribeSelect.vue'
import UiSubscribeRadioInput from '~/components/UiSubscribeRadioInput.vue'

export default {
  components: {
    UiValidationInput,
    UiSubscribeSelect,
    UiSubscribeRadioInput,
  },
  props: {
    setReceiptData: {
      type: Function,
      isRequired: true,
      default: () => {},
    },
    validateOn: {
      // for testing
      type: Boolean,
      default: true,
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
    $data: {
      handler(val) {
        const receiptData = {
          receiptPlan: val.receiptPlan,
          donateOrganization: val.donateOrganization,
          carrierType: val.carrierType,
          carrierNumber: val.carrierNumber,
          carrierTitle: val.carrierTitle,
          carrierUbn: val.carrierUbn,
        }

        // console.log(receiptData)
        this.setReceiptData(receiptData)
      },
      deep: true,
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
    isNeedToCheck() {
      return this.validateOn
    },
    carrierTypeList() {
      return [
        {
          name: 'email載具',
          value: 'mail',
        },
        {
          name: '手機條碼',
          value: '手機條碼',
        },
        {
          name: '自然人憑證',
          value: '自然人憑證',
        },
      ]
    },
    donateOrganizationList() {
      return [
        {
          name: '財團法人伊甸社會福利基金會',
          value: '財團法人伊甸社會福利基金會',
        },
        {
          name: '財團法人中華民國兒童福利聯盟文教基金會',
          value: '財團法人中華民國兒童福利聯盟文教基金會',
        },
        {
          name: '財團法人私立脊髓損傷潛能發展中心',
          value: '財團法人私立脊髓損傷潛能發展中心',
        },
      ]
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

      &_detail {
        margin-left: 30px;

        & > div {
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
