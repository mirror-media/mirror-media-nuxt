<template>
  <div
    class="validion-input"
    :class="{
      error:
        ((!$v.value.required && $v.value.$error) || !isValidInput) &&
        isNeedToCheck,
    }"
  >
    <input
      :value="$v.value.$model"
      @input="changeHandler"
      type="text"
      :placeholder="placeholder"
      :disabled="disable"
    />

    <template v-if="isNeedToCheck && this.value">
      <span v-show="!isValidInput" class="error__message">{{
        invalidMessage
      }}</span>
    </template>

    <span
      v-else-if="!$v.value.required && $v.value.$error && isNeedToCheck"
      class="error__message"
      >{{
        validateField === 'carrierNumber' ? '欄位' : placeholder
      }}不得為空</span
    >
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
export default {
  props: {
    //
    value: {
      type: String,
      isRequired: true,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    // validation
    validateField: {
      type: String,
      isRequired: true,
      default: '',
    },
    validateOn: {
      // for testing
      type: Boolean,
      default: true,
    },
    setReciptFormStatus: {
      type: Function,
      default: () => {},
    },
    carrierType: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      hasChange: false,
    }
  },
  validations: {
    value: {
      email,
      required,
    },
  },
  computed: {
    isNeedToCheck() {
      return this.validateOn
    },
    isValidInput() {
      if (!this.hasChange || this.validateField === 'carrierTitle') return true
      if (this.validateField === 'carrierUbn') {
        const reg = /^\d{8}$/
        return reg.test(this.value)
      }
      let reg, result
      switch (this.carrierType) {
        case '手機條碼':
          reg = /^\/(\d|[A-Z]|\.|\+|[-]){7}$/
          result = reg.test(this.value)
          break
        case '自然人憑證':
          reg = /^[A-Z]{2}\d{14}$/
          result = reg.test(this.value)
          break
        case '電子發票載具':
          result = this.$v.value.email
          break
        default:
          result = true
      }
      return result
    },
    invalidMessage() {
      if (this.validateField === 'carrierUbn') {
        return '請輸入有效的統一編號（8 碼）'
      }
      return `請輸入有效的${this.carrierType}`
    },
    disable() {
      return this.carrierType === '請選擇'
    },
  },
  methods: {
    changeHandler(e) {
      this.hasChange = true
      this.$v.value.$touch()
      this.$emit('input', e.target.value)
    },
    check() {
      if (this.isNeedToCheck) {
        this.$v.$touch()
        if (!this.$v.value.required || !this.isValidInput) {
          this.validationStatus = 'ERROR'
        } else {
          this.validationStatus = 'OK'
        }
      } else {
        this.validationStatus = 'OK'
      }

      this.setReciptFormStatus(this.validateField, this.validationStatus)
    },
  },
}
</script>

<style lang="scss" scoped>
.validion-input {
  position: relative;
}
</style>
