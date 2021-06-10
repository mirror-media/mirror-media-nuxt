<template>
  <div class="select">
    <select :value="value" @input="changeHandler">
      <option
        v-for="option in optionList"
        :key="option.value"
        :value="option.value || option.name"
      >
        {{ option.name }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  props: {
    //
    value: {
      type: String,
      isRequired: true,
      default: '',
    },
    optionList: {
      type: Array,
      default: () => {
        return [
          {
            name: 'email載具',
            value: 'mail',
          },
          {
            name: '手機條碼',
            value: '手機條碼',
          },
          {
            name: '自然人憑證',
            value: '自然人憑證',
          },
        ]
      },
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
.select {
  position: relative;
  select {
    height: 44px;
    width: 100%;
    padding: 11px 7px 11px;
    border-radius: 4px;
    box-shadow: inset 1px 1px 1px 0 rgba(0, 0, 0, 0.1);
    background: #f5f5f5;
    font-size: 15px;

    &:focus {
      outline: none;
    }
  }
}
</style>
