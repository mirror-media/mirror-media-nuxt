<template>
  <div
    class="validion-input"
    :class="{ error: $v.value.$error && isNeedToCheck }"
  >
    <input
      :value="$v.value.$model"
      @input="changeHandler"
      type="text"
      :placeholder="placeholder"
    />

    <span
      v-if="!$v.value.required && $v.value.$error && isNeedToCheck"
      class="error__message"
      >欄位不得為空</span
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
  },
  methods: {
    changeHandler(e) {
      this.$v.value.$touch()
      this.$emit('input', e.target.value)
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
