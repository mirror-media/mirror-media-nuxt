<template>
  <div
    class="validion-input"
    :class="{ error: $v.value.$error && isNeedToCheck }"
  >
    <input
      :value="$v.value.$model"
      @input="changeHandler"
      type="text"
      placeholder="統一編號"
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
    validateOn: {
      // for testing
      type: Boolean,
      default: true,
    },
    value: {
      type: String,
      isRequired: true,
      default: '',
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
  },
}
</script>

<style lang="scss" scoped>
.validion-input {
  position: relative;
}
</style>
