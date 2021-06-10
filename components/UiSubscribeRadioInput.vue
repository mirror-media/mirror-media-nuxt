<template>
  <div class="radio-input">
    <input
      :checked="value === radioValue"
      type="radio"
      :value="radioValue"
      @input="changeHandler"
    />
    <span class="radio">{{ radioName }}</span>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      isRequired: true,
      default: '',
    },
    radioValue: {
      type: String,
      isRequired: true,
      default: '捐贈',
    },
    radioName: {
      type: String,
      isRequired: true,
      default: '捐贈',
    },
  },

  methods: {
    changeHandler(e) {
      this.$emit('input', e.target.value)
    },
  },
}
</script>

<style lang="scss" scoped>
.radio-input {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 18px;
  line-height: normal;

  input[type='radio'] {
    margin-right: 8px;
  }
}
</style>
