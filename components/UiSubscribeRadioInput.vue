<template>
  <div class="radio-input">
    <div class="radio-input__input">
      <input
        :checked="value === radioValue"
        type="radio"
        :value="radioValue"
        :class="{ invalid: !isValid }"
        @input="changeHandler"
      />
      <span class="radio">{{ radioName }} </span>
    </div>
    <ul v-if="radioValue === '限時掛號'" class="radio-input__total">
      <li v-for="hint in hints" :key="hint.text">
        {{ hint }}
      </li>
    </ul>
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
    hints: {
      type: Array,
      default: () => [],
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
    isValid: {
      type: Boolean,
      isRequired: false,
      default: true,
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
  margin-bottom: 10px;
  &__input {
    display: flex;
    align-items: center;
    font-size: 18px;
    line-height: normal;

    input[type='radio'] {
      -webkit-appearance: none;
      appearance: none;
      margin-right: 8px;
      width: 20px;
      height: 20px;
      padding: 0px;
      border-width: 2px;
      border-style: solid;
      border-color: #000000;
      border-radius: 50%;
      background-color: #ffffff;
      opacity: 0.4;
      outline: none;

      &.invalid {
        border-color: #e51731;
        opacity: 1;
      }

      &:hover {
        opacity: 0.5;
      }

      &::before {
        content: '';
        display: block;
        width: 70%;
        height: 70%;
        margin: 15% auto;
        border-radius: 50%;
      }

      &:checked {
        border-color: var(--swiper-theme-color);
        opacity: 1;

        &::before {
          background-color: var(--swiper-theme-color);
        }
      }
    }
  }

  &__total {
    margin-left: 50px;
    font-size: 16px;
    list-style: disc;
    line-height: 1.5;
  }
}
</style>
