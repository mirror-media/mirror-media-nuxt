<template>
  <div class="count-button" :class="{ disable: isDisable }">{{ symbol }}</div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      isRequired: true,
      default: '',
    },
    isDisable: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    symbol() {
      return this.type === 'increase' ? '+' : '-'
    },
  },
}
</script>

<style lang="scss" scoped>
.count-button {
  user-select: none;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 17px;
  line-height: 20px;
  color: #054f77;
  border-radius: 50%;
  background: #ffffff;
  border: 1px solid #054f77;

  &:hover {
    background: linear-gradient(
        0deg,
        rgba(5, 79, 119, 0.05),
        rgba(5, 79, 119, 0.05)
      ),
      #ffffff;
  }
  &:active {
    background: linear-gradient(
        0deg,
        rgba(5, 79, 119, 0.1),
        rgba(5, 79, 119, 0.1)
      ),
      #ffffff;
  }

  &.disable {
    cursor: not-allowed;
    background: #e3e3e3;
    border: 1px solid rgba(0, 0, 0, 0.2);
    color: rgba(0, 0, 0, 0.2);
  }
}
</style>
