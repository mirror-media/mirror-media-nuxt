<template>
  <input
    type="text"
    placeholder=""
    :value="value"
    @input="$emit('input', $event.target.value)"
  />
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['value'],
}
</script>

<style lang="scss" scoped>
input {
  width: 100%;
  height: 48px;
  left: 69px;
  top: 162px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.3);
  color: black;
  border-radius: 2px;
  padding: 12px;
  outline: none;
  &::placeholder {
    color: rgba(0, 0, 0, 0.3);
  }
  &:focus {
    border: 1px solid rgba(0, 0, 0, 0.87);
  }
}

.border-black {
  border: 1px solid rgba(0, 0, 0, 0.87);
}
</style>
