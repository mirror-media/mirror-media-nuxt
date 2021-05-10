<template>
  <div class="input-wrapper">
    <UiMembershipInputPassword
      v-model.trim="$v.password.$model"
      :className="{ 'border-red': shouldShowErrorHint }"
      :placeholder="`密碼大於 ${passwordMinLength} 位數`"
      @input="handleInput"
    />
    <p v-show="shouldShowErrorHint" class="invalid-hint">
      密碼錯誤，請重新嘗試
    </p>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { minLength, required } from 'vuelidate/lib/validators'
import UiMembershipInputPassword from './UiMembershipInputPassword.vue'

const passwordMinLength = 6

export default {
  components: {
    UiMembershipInputPassword,
  },
  mixins: [validationMixin],
  props: {
    shouldShowErrorHint: {
      type: Boolean,
      default: false,
    },
  },
  validations: {
    password: {
      required,
      minLength: minLength(passwordMinLength),
    },
  },
  data() {
    return {
      password: '',
      passwordMinLength,
    }
  },
  watch: {
    '$v.password.$invalid'(value) {
      this.$emit('inputValidStateChange', !value)
    },
  },
  methods: {
    handleInput() {
      this.$emit('input', this.password)
    },
  },
}
</script>

<style lang="scss" scoped>
.input-wrapper {
  width: 100%;
}

.invalid-hint {
  margin: 8px 0 0 0;
  font-size: 16px;
  line-height: 150%;
  color: #db1730;
}
</style>
