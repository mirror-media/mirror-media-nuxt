<template>
  <div
    class="subcribe-button"
    :class="{
      'subscribe-button__grey': color === 'grey',
      'subscribe-button__light': color === 'light',
      disabled: isDisabled,
    }"
  >
    {{ title }}
    <p class="subcribe-button__hint">{{ hint }}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      isRequired: true,
      default: '',
    },
    hint: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: 'original',
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
.subcribe-button {
  user-select: none;
  font-size: 18px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
  padding: 13px 13px 12px;
  width: 100%;
  max-width: 340px;
  border-radius: 2px;
  cursor: pointer;
  background-color: #054f77;

  &:active,
  &:hover {
    background: linear-gradient(
        0deg,
        rgba(29, 159, 184, 0.3),
        rgba(29, 159, 184, 0.3)
      ),
      #054f77;
  }

  @include media-breakpoint-up(sm) {
    padding: 15px 15px 15px;
  }

  &.subscribe-button__grey {
    color: #4a4a4a;
    background: rgb(217, 217, 217);
    &:active {
      background: rgb(155, 155, 155);
    }
  }

  &.subscribe-button__light {
    background: #1d9fb8;
    &:hover {
      background: linear-gradient(
          0deg,
          rgba(5, 79, 119, 0.3),
          rgba(5, 79, 119, 0.3)
        ),
        #1d9fb8;
    }
    &:active {
      background: linear-gradient(
          0deg,
          rgba(5, 79, 119, 0.5),
          rgba(5, 79, 119, 0.5)
        ),
        #1d9fb8;
    }
  }

  &.disabled {
    background: #e3e3e3;
    color: rgba(0, 0, 0, 0.2);
    cursor: not-allowed;
  }

  &__hint {
    margin-top: 4px;
    font-size: 13px;
    line-height: 18px;
    color: #ffffff;
    opacity: 0.66;
  }
}
</style>
