<template>
  <div class="count-button" :class="{ disable: isDisable }">
    <img
      v-if="isAdd"
      :src="require('~/assets/count-button-increase.svg')"
      alt="＋"
    />
    <img
      v-else
      :src="require('~/assets/count-button-decrease.svg')"
      alt="−"
      class="count-button__decrease"
    />
  </div>
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
    isAdd() {
      return this.type === 'increase'
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
  // display: flex;
  // justify-content: center;
  // align-items: center;
  font-size: 17px;
  line-height: 20px;
  color: #054f77;
  border-radius: 50%;
  background: #ffffff;
  border: 1px solid #054f77;
  position: relative;

  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

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

    img {
      filter: invert(0%) sepia(100%) saturate(0%) hue-rotate(71deg)
        brightness(99%) contrast(101%);
      opacity: 0.2;
    }
  }
}
</style>
