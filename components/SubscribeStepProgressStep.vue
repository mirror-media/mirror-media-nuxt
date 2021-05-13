<template>
  <div class="progress-step" :class="{ 'progress-step-active': isActive }">
    <div class="progress-step__step">
      {{ step }}
    </div>

    <div class="progress-step__name">
      {{ name }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    step: {
      type: Number,
      isRequired: true,
    },
    name: {
      type: String,
      isRequired: true,
    },
    isActive: {
      type: Boolean,
      isRequired: true,
      default: () => {
        return false
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.progress-step {
  background: #054f77;
  display: flex;
  align-items: center;
  cursor: pointer;

  &__step {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #9b9b9b;
    color: #054f77;
    font-weight: 600;
    font-size: 18px;
    line-height: 30px;
    text-align: center;
    margin-right: 8px;

    @include media-breakpoint-up(sm) {
      width: 40px;
      height: 40px;
      font-size: 26px;
      line-height: 40px;
    }
  }

  &__name {
    color: #9b9b9b;
    width: 30px;
    height: 42px;
    font-size: 15px;
    @include media-breakpoint-up(sm) {
      width: auto;
      height: auto;
      font-size: 26px;
      line-height: 36px;
    }
  }

  &.progress-step-active {
    .progress-step__step {
      background: white;
    }
    .progress-step__name {
      color: white;
    }
  }
}
</style>
