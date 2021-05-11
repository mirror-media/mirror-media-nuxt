<template>
  <div class="input-wrapper">
    <UiMembershipInputPassword
      v-model.trim="$v.password.$model"
      :placeholder="placeholder"
      @input="handleInput"
    />
    <p v-show="$v.$dirty && $v.$invalid" class="valid-hint">
      <span>密碼在 {{ passwordMinLength }} 位數以上</span>
    </p>
    <p v-show="$v.$dirty && !$v.$invalid" class="valid-hint valid-hint--green">
      <SvgCheckIcon class="valid-hint__check-icon" />
      <span>密碼在 {{ passwordMinLength }} 位數以上</span>
    </p>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { minLength, required } from 'vuelidate/lib/validators'
import UiMembershipInputPassword from './UiMembershipInputPassword.vue'
import SvgCheckIcon from '~/assets/membership-validation-check-icon.svg?inline'

const passwordMinLength = 6

export default {
  components: {
    UiMembershipInputPassword,
    SvgCheckIcon,
  },
  mixins: [validationMixin],
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
  computed: {
    placeholder() {
      return this.$attrs.placeholder ?? `密碼大於 ${passwordMinLength} 位數`
    },
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

.valid-hint {
  margin: 8px 0 0 0;
  font-size: 16px;
  line-height: 150%;
  color: #9b9b9b;
  display: flex;
  align-items: center;
  &--green {
    color: #009045;
  }

  &__check-icon {
    margin: 0 8px 0 0;
  }
}
</style>
