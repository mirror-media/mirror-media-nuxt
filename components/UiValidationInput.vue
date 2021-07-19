<template>
  <div
    class="validion-input"
    :class="{
      error:
        ($v.value.$error || !isValidCarrierUbn) && hasChange && isNeedToCheck,
    }"
  >
    <input
      :value="$v.value.$model"
      @input="changeHandler"
      type="text"
      :placeholder="placeholder"
      :disabled="disable"
    />

    <span
      v-if="isNeedToCheck && !isValidCarrierUbn && this.value && hasChange"
      class="error__message"
      >請輸入有效的統一編號（8 碼）</span
    >

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
import { required } from 'vuelidate/lib/validators'
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
      required,
    },
  },
  computed: {
    isNeedToCheck() {
      return this.validateOn
    },
    isValidCarrierUbn() {
      if (this.validateField !== 'carrierUbn') return true
      const reg = /^\d{8}$/
      return reg.test(this.value)
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
      this.value = e.target.value
    },
    check() {
      if (this.isNeedToCheck) {
        this.$v.$touch()
        if (this.$v.$invalid) {
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
