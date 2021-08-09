<template>
  <label>
    <input
      type="checkbox"
      :id="content"
      :value="content"
      @change="handleChange"
    />
    {{ content }}</label
  >
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      required: true,
      default: '',
    },
  },
  methods: {
    handleChange(event) {
      const isChecked = event.target.checked
      const emitEvent = { value: event.target.value }
      emitEvent.type = isChecked ? 'add' : 'remove'
      this.$emit('change', emitEvent)
    },
  },
}
</script>

<style lang="scss" scoped>
label {
  display: block;
  color: rgba(0, 0, 0, 0.87);

  input {
    height: 16px;
    width: 16px;
    margin-right: 8px;
  }

  &:not(:first-child) {
    margin-top: 8px;
  }
}
</style>
