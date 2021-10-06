<template>
  <div class="receipt">
    <h2 class="subscribe-form__title">電子發票</h2>

    <p
      v-show="isNeedToCheck && receiptFormStatus.receiptPlan === 'ERROR'"
      class="receipt__error"
    >
      以下尚未勾選
    </p>
    <div class="receipt__choose">
      <div class="receipt__choose_item">
        <UiSubscribeRadioInput
          v-model="receiptData.receiptPlan"
          radioValue="捐贈"
          radioName="捐贈"
        />

        <div
          v-if="receiptData.receiptPlan === '捐贈'"
          class="receipt__choose_item_detail"
        >
          <UiSubscribeSelect
            ref="donateOrganizationDOM"
            v-model="receiptData.donateOrganization"
            :optionList="donateOrganizationList"
            validateField="donateOrganization"
            :validateOn="validateOn"
            :setReciptFormStatus="setReciptFormStatus"
          />
        </div>
      </div>

      <div class="receipt__choose_item">
        <UiSubscribeRadioInput
          v-model="receiptData.receiptPlan"
          radioValue="二聯式發票（含載具）"
          radioName="二聯式發票（含載具）"
        />

        <div
          v-if="receiptData.receiptPlan === '二聯式發票（含載具）'"
          class="receipt__choose_item_detail"
        >
          <UiSubscribeSelect
            ref="carrierTypeDOM"
            v-model="receiptData.carrierType"
            :optionList="carrierTypeList"
            validateField="carrierType"
            :validionOn="true"
            :setReciptFormStatus="setReciptFormStatus"
            @handleChangeCarrierType="handleChangeCarrierType"
          />
          <UiValidationInput
            ref="carrierNumberDOM"
            v-if="receiptData.carrierType && receiptData.carrierType < 2"
            v-model="receiptData.carrierNumber"
            :carrierType="receiptData.carrierType"
            :placeholder="carrierNumberPlaceHolder"
            validateField="carrierNumber"
            :validionOn="true"
            :setReciptFormStatus="setReciptFormStatus"
          />
        </div>
      </div>

      <div class="receipt__choose_item">
        <UiSubscribeRadioInput
          v-model="receiptData.receiptPlan"
          radioValue="三聯式發票"
          radioName="三聯式發票"
        />

        <div
          v-if="receiptData.receiptPlan === '三聯式發票'"
          class="receipt__choose_item_detail"
        >
          <UiValidationInput
            ref="carrierTitleDOM"
            v-model="receiptData.carrierTitle"
            placeholder="抬頭"
            validateField="carrierTitle"
            :validionOn="true"
            :setReciptFormStatus="setReciptFormStatus"
          />

          <UiValidationInput
            ref="carrierUbnDOM"
            v-model="receiptData.carrierUbn"
            placeholder="統一編號"
            validateField="carrierUbn"
            :validionOn="true"
            :setReciptFormStatus="setReciptFormStatus"
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
    setFormStatus: {
      type: Function,
      default: () => {},
    },
    email: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      receiptData: {
        receiptPlan: '',
        donateOrganization: '',
        carrierType: '',
        carrierNumber: '',
        carrierTitle: '',
        carrierUbn: '',
      },
      submitStatus: null,

      receiptFormStatus: {
        receiptPlan: 'OK',
        donateOrganization: 'OK',
        carrierType: 'OK',
        carrierNumber: 'OK',
        carrierTitle: 'OK',
        carrierUbn: 'OK',
      },
    }
  },

  computed: {
    carrierNumberPlaceHolder() {
      let placeholder = ''

      switch (this.receiptData.carrierType) {
        case '2': // '電子發票載具'
          placeholder = 'example@gmail.com'
          break

        case '0': // '手機條碼'
          placeholder = '斜線字元 /，後接 7 個大寫英數字或特殊符號'
          break

        case '1': // '自然人憑證'
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
          name: '請選擇',
          value: '',
        },
        {
          name: '電子發票載具',
          value: '2',
        },
        {
          name: '手機條碼',
          value: '0',
        },
        {
          name: '自然人憑證',
          value: '1',
        },
      ]
    },
    donateOrganizationList() {
      return [
        {
          name: '請選擇',
          value: '',
        },
        {
          name: '財團法人台灣兒童暨家庭扶助基金會',
          value: '8585',
        },
        {
          name: '財團法人創世社會福利基金會',
          value: '919',
        },
        {
          name: '財團法人台灣癌症基金會',
          value: '1799',
        },
        {
          name: '財團法人伊甸社會福利基金會',
          value: '25585',
        },
        {
          name: '財團法人門諾社會福利慈善事業基金會',
          value: '5260',
        },
      ]
    },
  },
  watch: {
    receiptData: {
      handler(val) {
        this.setReceiptData(val)
        if (val.receiptPlan !== '二聯式發票（含載具）') {
          this.receiptData.carrierType = '請選擇'
          this.receiptData.carrierNumber = ''
        } else if (this.receiptData.carrierType === '2') {
          this.receiptData.carrierNumber = this.emailb
        }
        // reset validation status after chagned value
        this.receiptFormStatus = {
          receiptPlan: 'OK',
          donateOrganization: 'OK',
          carrierType: 'OK',
          carrierNumber: 'OK',
          carrierTitle: 'OK',
          carrierUbn: 'OK',
        }
      },
      deep: true,
    },
    email(newMail) {
      if (this.receiptData.carrierType === '2') {
        this.receiptData.carrierNumber = newMail
      }
    },
  },
  methods: {
    setReciptFormStatus(type, formStatus) {
      this.receiptFormStatus[type] = formStatus
    },
    validationPass() {
      const validateArray = Object.values(this.receiptFormStatus)
      if (validateArray.find((item) => item !== 'OK')) {
        return 'ERROR'
      } else {
        return 'OK'
      }
    },
    check() {
      if (this.isNeedToCheck) {
        // check subForm's validation
        if (this.receiptData.receiptPlan === '捐贈') {
          this.$refs.donateOrganizationDOM.check()
        } else if (this.receiptData.receiptPlan === '二聯式發票（含載具）') {
          this.$refs.carrierTypeDOM.check()
          this.$refs.carrierNumberDOM.check()
        } else if (this.receiptData.receiptPlan === '三聯式發票') {
          this.$refs.carrierTitleDOM.check()
          this.$refs.carrierUbnDOM.check()
        } else {
          this.receiptFormStatus.receiptPlan = 'ERROR'
        }
      }

      this.setFormStatus('receipt', this.validationPass())
    },
    handleChangeCarrierType() {
      this.receiptData.carrierNumber = ''
    },
  },
}
</script>

<style lang="scss" scoped>
.receipt {
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

  &__error {
    font-size: 16px;
    line-height: 150%;
    color: #e51731;
    margin-bottom: 8px;
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
