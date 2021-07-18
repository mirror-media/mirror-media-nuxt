<template>
  <div class="radio-input">
    <div class="radio-input__input">
      <input
        :checked="value === radioValue"
        type="radio"
        :value="radioValue"
        @input="changeHandler"
      />
      <span class="radio">{{ radioName }} </span>
    </div>
    <ul v-if="radioValue === '限時掛號'" class="radio-input__total">
      <li>一年期加收 NT$ 1,040</li>
      <li>二年期加收 NT$ 2,080</li>
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
  margin-bottom: 10px;
  &__input {
    display: flex;
    align-items: center;
    font-size: 18px;
    line-height: normal;

    input[type='radio'] {
      margin-right: 8px;
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
