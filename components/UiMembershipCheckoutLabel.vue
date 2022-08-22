<template>
  <label>
    <input
      :id="content"
      v-model="checked"
      type="checkbox"
      :value="content"
      @change="$emit('handle-change')"
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
  data() {
    return {
      checked: false,
    }
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
