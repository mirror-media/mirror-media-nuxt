<template>
  <div class="orderer-data">
    <h2 class="subscribe-form__title">{{ type }}</h2>
    <template v-if="!isOrderer">
      <p class="orderer-data__detail">資料請務必正確填寫，以利雜誌寄送。</p>
      <div class="orderer-data__check">
        <input
          type="checkbox"
          :value="disable"
          placeholder="我是範例"
          @change="setDisable"
        /><span>同訂購人資訊</span>
      </div>
    </template>
    <div
      class="orderer-data__input_wrapper half"
      :class="{ error: $v.name.$error && isNeedToCheck }"
    >
      <span>姓名</span>
      <input
        v-model.trim="$v.name.$model"
        type="text"
        :placeholder="`${type}姓名`"
        :disabled="disable"
      />
      <span
        v-show="!$v.name.required && $v.name.$error && isNeedToCheck"
        class="error__message"
        >{{ type }}姓名不可空白</span
      >
    </div>

    <div class="phone">
      <div
        class="orderer-data__input_wrapper phone__cellphone"
        :class="{
          error:
            ($v.cellphone.$error || !isValidPhone) &&
            isNeedToCheck &&
            shouldShowPhoneError,
        }"
      >
        <span>手機</span>
        <input
          v-model.trim="$v.cellphone.$model"
          :disabled="disable"
          placeholder="0912345678"
          type="text"
          @input="handleInputCellphone"
        />
        <span
          v-if="!$v.cellphone.required && $v.cellphone.$error && isNeedToCheck"
          class="error__message"
          >{{ type }}聯絡電話不可空白</span
        >
        <span
          v-else-if="!isValidPhone && isNeedToCheck && shouldShowPhoneError"
          class="error__message"
          >請輸入有效的聯絡電話</span
        >
      </div>

      <div class="orderer-data__input_wrapper phone__phone">
        <span>市話（非必填）</span>
        <div class="orderer-data__input_wrapper multi">
          <input
            v-model="phone"
            :disabled="disable"
            class="multi__phone"
            type="text"
            placeholder="023456789"
          />
          <span>-</span>
          <input
            v-model="phoneExt"
            :disabled="disable"
            class="multi__ext"
            type="text"
            placeholder="EXT"
          />
        </div>
      </div>
    </div>

    <div
      class="orderer-data__input_wrapper"
      :class="{ error: $v.address.$error && isNeedToCheck }"
    >
      <span>通訊地址</span>
      <input
        v-model.trim="$v.address.$model"
        :disabled="disable"
        type="text"
        :placeholder="`${type}請填入郵遞區號和完整地址，範例：114066台北市內湖區堤頂大道一段365號1樓`"
      />
      <span
        v-show="!$v.address.required && $v.address.$error && isNeedToCheck"
        class="error__message"
        >{{ type }}通訊地址不可空白</span
      >
    </div>

    <div
      v-if="isOrderer"
      class="orderer-data__input_wrapper"
      :class="{ error: $v.email.$error && isNeedToCheck }"
    >
      <span>電子信箱</span>
      <input
        v-model.trim="$v.email.$model"
        :disabled="disable"
        type="text"
        :placeholder="`${type}電子信箱`"
      />
      <span
        v-show="!$v.email.email && $v.email.$error && isNeedToCheck"
        class="error__message"
        >請輸入有效的 Email 地址</span
      >
      <span
        v-show="!$v.email.required && $v.email.$error && isNeedToCheck"
        class="error__message"
        >{{ type }}電子郵件不得為空</span
      >
    </div>
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
import { isValidPhoneNumber } from 'libphonenumber-js'

export default {
  props: {
    type: {
      type: String,
      isRequired: true,
      default: '訂購人',
    },
    ordererData: {
      type: Object,
      default: () => {},
    },
    setOrdererData: {
      type: Function,
      default: () => {},
    },
    receiverDataIsSameAsOrderer: {
      type: Boolean,
      default: false,
    },
    setReceiverDataIsSameAsOrderer: {
      type: Function,
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
  },
  data() {
    return {
      submitStatus: null,
      validateSwitch: true,
      name: '',
      cellphone: '',
      phone: '',
      phoneExt: '',
      address: '',
      email: '',
      shouldShowPhoneError: false,
    }
  },
  validations: {
    name: {
      required,
    },
    cellphone: {
      required,
    },
    address: {
      required,
    },
    email: {
      email,
      required,
    },
  },

  computed: {
    disable() {
      return this.receiverDataIsSameAsOrderer
    },
    isOrderer() {
      return this.type !== '收件人'
    },
    isNeedToCheck() {
      return !this.receiverDataIsSameAsOrderer && this.validateOn
    },
    getFormType() {
      switch (this.type) {
        case '訂購人':
          return 'orderer'
        case '收件人':
          return 'receiver'
        default:
          return 'orderer'
      }
    },
    isValidPhone() {
      return isValidPhoneNumber(this.cellphone, 'TW')
    },
  },
  watch: {
    ordererData: {
      deep: true,
      handler() {
        if (this.receiverDataIsSameAsOrderer) {
          const {
            name,
            cellphone,
            phone,
            phoneExt,
            address,
            email,
          } = this.ordererData
          this.name = name
          this.cellphone = cellphone
          this.phone = phone
          this.phoneExt = phoneExt
          this.address = address
          this.email = email
        }
      },
    },
    name(val) {
      if (this.getFormType === 'orderer') {
        this.setOrdererData({ ...this.ordererData, name: val })
      }
    },
    cellphone(val) {
      if (this.getFormType === 'orderer') {
        this.setOrdererData({ ...this.ordererData, cellphone: val })
      }
    },
    phone(val) {
      if (this.getFormType === 'orderer') {
        this.setOrdererData({ ...this.ordererData, phone: val })
      }
    },
    phoneExt(val) {
      if (this.getFormType === 'orderer') {
        this.setOrdererData({ ...this.ordererData, phoneExt: val })
      }
    },
    address(val) {
      if (this.getFormType === 'orderer') {
        this.setOrdererData({ ...this.ordererData, address: val })
      }
    },
    email(val) {
      if (this.getFormType === 'orderer') {
        this.setOrdererData({ ...this.ordererData, email: val })
      }
    },
  },

  methods: {
    setDisable(e) {
      e.preventDefault()
      this.setReceiverDataIsSameAsOrderer(!this.receiverDataIsSameAsOrderer)
      if (this.receiverDataIsSameAsOrderer) return
      const {
        name,
        cellphone,
        phone,
        phoneExt,
        address,
        email,
      } = this.ordererData
      this.name = name
      this.cellphone = cellphone
      this.phone = phone
      this.phoneExt = phoneExt
      this.address = address
      this.email = email
    },
    check() {
      if (this.isNeedToCheck) {
        this.$v.$touch()
        if (!this.isOrderer) {
          this.email = this.ordererData.email
        }
        if (this.$v.$invalid || !this.isValidPhone) {
          this.submitStatus = 'ERROR'
        } else {
          this.submitStatus = 'OK'
        }
      } else {
        this.submitStatus = 'OK'
      }

      this.setFormStatus(this.getFormType, this.submitStatus)

      // after check, feed formData to parent
      return {
        name: this.name,
        cellphone: this.cellphone,
        phone: this.phone,
        phoneExt: this.phoneExt,
        address: this.address,
        email: this.email,
      }
    },
    handleInputCellphone() {
      this.shouldShowPhoneError = true
    },
  },
}
</script>

<style lang="scss" scoped>
.orderer-data {
  position: relative;
  padding: 0 calc(25px - 8px);

  @include media-breakpoint-up(md) {
    padding: 0;
  }

  &__detail {
    margin-bottom: 16px;
    font-size: 16px;
    line-height: 150%;
    color: rgba(0, 0, 0, 0.66);
  }

  &__check {
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    span {
      font-size: 18px;
      color: #4a4a4a;
      margin-bottom: 0;
    }
  }

  &__input_wrapper {
    margin-bottom: 11px;
    width: 100%;

    &.half {
      width: 180px;

      @include media-breakpoint-up(md) {
        width: calc((100% - 30px) / 2);
      }
    }

    &.phone {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      @include media-breakpoint-up(md) {
        flex-direction: row;
      }

      &__cellphone {
        width: 180px;
        @include media-breakpoint-up(md) {
          width: calc((100% - 30px) / 2);
        }
      }

      &__phone {
        width: 270px;
        @include media-breakpoint-up(md) {
          width: calc((100% - 30px) / 2);
        }
      }
    }

    .multi {
      display: flex;
      align-items: center;

      & > input {
        margin-right: 4px;

        &:last-child {
          margin-left: 4px;
          margin-right: 0;
        }
      }

      &__phone {
        width: 180px;
      }

      // &__ext {
      //   width: 72px;
      // }
    }
  }
}
</style>
