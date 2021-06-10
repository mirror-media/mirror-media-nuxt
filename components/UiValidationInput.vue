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

    validateOn: {
      // for testing
      type: Boolean,
      default: true,
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
