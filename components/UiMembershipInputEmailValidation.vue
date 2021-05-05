<template>
  <div class="input-wrapper">
    <UiMembershipInput
      v-model.trim="$v.email.$model"
      type="email"
      placeholder="name@example.com"
      @input="handleInput"
    />
    <p v-show="$v.$invalid" class="valid-hint">
      <span>Email 格式正確</span>
    </p>
    <p v-show="!$v.$invalid" class="valid-hint valid-hint--green">
      <SvgCheckIcon class="valid-hint__check-icon" />
      <span>Email 格式正確</span>
    </p>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { email, required } from 'vuelidate/lib/validators'
import UiMembershipInput from './UiMembershipInput.vue'
import SvgCheckIcon from '~/assets/membership-validation-check-icon.svg?inline'

export default {
  components: {
    UiMembershipInput,
    SvgCheckIcon,
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
  watch: {
    '$v.email.$invalid'(value) {
      this.$emit('inputValidStateChange', !value)
    },
  },
  beforeMount() {
    if (this.emailProps) {
      this.email = this.emailProps
    }
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
