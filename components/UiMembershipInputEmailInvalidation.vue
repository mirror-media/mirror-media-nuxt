<template>
  <div class="input-wrapper">
    <UiMembershipInput
      v-model.trim="$v.email.$model"
      :class="{ 'border-black': canShowInputInvalid }"
      type="email"
      placeholder="name@example.com"
      @input="handleInput"
    />
    <p v-show="canShowInputInvalid" class="invalid-hint">
      請輸入有效 Email 地址
    </p>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { email, required } from 'vuelidate/lib/validators'
import UiMembershipInput from './UiMembershipInput.vue'

export default {
  components: {
    UiMembershipInput,
  },
  mixins: [validationMixin],
  props: {
    shouldShowInvalidHint: {
      type: Boolean,
      default: false,
    },
    emailProps: {
      type: String,
      default: '',
    },
  },
  validations: {
    email: {
      required,
      email,
    },
  },
  data() {
    return {
      email: '',
    }
  },
  computed: {
    canShowInputInvalid() {
      return this.shouldShowInvalidHint && this.$v.$dirty && this.$v.$invalid
    },
  },
  watch: {
    shouldShowInvalidHint() {
      /*
       * toggling invalid hint when input was empty but we really want to show it
       * because invalid hint was always disable if we never touch it
       */
      if (this.shouldShowInvalidHint && !this.$v.$dirty) {
        // same as this.$v.$dirty = true
        this.$v.$touch()
      }
    },
    '$v.email.$invalid'(value) {
      this.$emit('inputValidStateChange', !value)
    },
  },
  beforeMount() {
    this.email = this.emailProps
  },
  methods: {
    handleInput() {
      this.$emit('input', this.email)
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
