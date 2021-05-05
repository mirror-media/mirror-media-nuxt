<template>
  <div class="input-button-wrapper">
    <UiMembershipInput
      v-model.trim="password"
      :type="shouldRevealPassword ? 'text' : 'password'"
      :placeholder="$attrs.placeholder"
      @input="handleInput"
    />
    <button
      class="input-button-wrapper__reveal-password-button reveal-password-button"
      @click="handleRevealPasswordButtonClick"
    >
      <SvgPasswordIsHiding
        v-show="!shouldRevealPassword"
        class="reveal-password-button__icon"
      />
      <SvgPasswordIsRevealing
        v-show="shouldRevealPassword"
        class="reveal-password-button__icon"
      />
    </button>
  </div>
</template>

<script>
import UiMembershipInput from './UiMembershipInput.vue'
import SvgPasswordIsHiding from '~/assets/membership-password-is-hiding.svg?inline'
import SvgPasswordIsRevealing from '~/assets/membership-password-is-revealing.svg?inline'

export default {
  components: {
    UiMembershipInput,
    SvgPasswordIsHiding,
    SvgPasswordIsRevealing,
  },
  data() {
    return {
      password: '',
      shouldRevealPassword: false,
    }
  },
  methods: {
    handleInput() {
      this.$emit('input', this.password)
    },
    handleRevealPasswordButtonClick() {
      this.shouldRevealPassword = !this.shouldRevealPassword
    },
  },
}
</script>

<style lang="scss" scoped>
.input-button-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  &__reveal-password-button {
    position: absolute;
    right: 12px;
  }
}

.reveal-password-button {
  height: 18px;
  padding: 0 0 0 12px;
  background-color: white;
  outline: none;
  &__icon {
    height: 100%;
  }
}
</style>
