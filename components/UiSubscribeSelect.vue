<template>
  <div class="select" :class="{ error: $v.value.$error && isNeedToCheck }">
    <select :value="$v.value.$model" @input="changeHandler">
      <option
        v-for="option in optionList"
        :key="option.value"
        :value="option.value"
      >
        {{ option.name }}
      </option>
    </select>
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
    optionList: {
      type: Array,
      default: () => {
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
  data() {
    return {
      validationStatus: 'OK',
    }
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
.select {
  position: relative;
  select {
    height: 48px;
    width: 100%;
    padding: 12px;
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 2px;
    background: #ffffff;
    font-size: 15px;

    &:focus {
      outline: none;
    }
  }
}
</style>
