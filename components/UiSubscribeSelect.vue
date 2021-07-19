<template>
  <div
    v-click-outside="hideOption"
    class="select"
    :class="{ error: $v.value.$error && isNeedToCheck, isFocused }"
  >
    <ul>
      <li
        :key="choosenOptionName"
        class="select__choosen"
        @click="toggleOptionField"
      >
        {{ choosenOptionName }}
      </li>
      <section v-show="shouldShowOptionField">
        <div class="select__devider" />
        <li
          v-for="option in optionList.slice(1)"
          :key="option.value"
          :value="option.value"
          @click="changeHandler(option)"
        >
          {{ option.name }}
        </li>
      </section>
    </ul>
    <span
      v-if="!$v.value.required && $v.value.$error && isNeedToCheck"
      class="error__message"
      >欄位不得為空</span
    >
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
export default {
  props: {
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
    // validation
    validateField: {
      type: String,
      isRequired: true,
      default: '',
    },
    validateOn: {
      // for testing
      type: Boolean,
      default: true,
    },
    setReciptFormStatus: {
      type: Function,
      default: () => {},
    },
  },
  validations: {
    value: {
      required,
    },
  },
  data() {
    return {
      choosenOptionName: '請選擇',
      validationStatus: 'OK',
      shouldShowOptionField: false,
      isFocused: false,
    }
  },
  computed: {
    isNeedToCheck() {
      return this.validateOn
    },
  },
  methods: {
    changeHandler(option) {
      this.$v.value.$touch()
      this.$emit('input', option.value)
      this.choosenOptionName = option.name
      this.shouldShowOptionField = false
      this.$emit('handleChangeCarrierType')
    },
    check() {
      if (this.isNeedToCheck) {
        this.$v.$touch()
        if (this.$v.$invalid) {
          this.validationStatus = 'ERROR'
        } else {
          this.validationStatus = 'OK'
        }
      } else {
        this.validationStatus = 'OK'
      }

      this.setReciptFormStatus(this.validateField, this.validationStatus)
    },
    toggleOptionField() {
      this.shouldShowOptionField = !this.shouldShowOptionField
      this.isFocused = !this.isFocused
    },
    hideOption() {
      this.shouldShowOptionField = false
      this.isFocused = false
    },
  },
}
</script>

<style lang="scss" scoped>
.select {
  position: relative;
  height: 48px;

  &__devider {
    height: 12px;
    width: calc(100% - 24px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.3);
    margin: 0 12px 4px 12px;
  }

  &__choosen {
    cursor: pointer;
    user-select: none;
    display: block;
    width: 100%;
    text-align: left;
    position: relative;
    background-color: #fff;
    color: rgba(0, 0, 0, 0.87);
    font-size: 18px;
    padding: 0 12px !important;
    &::after {
      content: '';
      display: block;
      position: absolute;
      right: 12px;
      top: 20%;
      width: 12px;
      height: 12px;
      border-color: #054f77;
      border-style: solid;
      border-width: 1px 1px 0 0;
      transform: rotate(135deg);
    }
  }

  ul {
    z-index: 2;
    color: #1b1b1b;
    position: absolute;
    width: 100%;
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 2px;
    font-size: 18px;
    padding: 12px 0;
    & li {
      height: 100%;
      background: #fff;
      padding: 8px 12px;
      cursor: pointer;
      user-select: none;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      &:not(:first-child) {
        &:hover {
          background-color: #054f77;
          color: #fff;
        }
      }
    }
  }
}

.isFocused {
  ul {
    border: 1px solid rgba(0, 0, 0, 0.87);
    box-shadow: 0px 2px 8px 2px rgba(0, 0, 0, 0.1);
    li {
      &::after {
        transform: rotate(315deg);
        top: 40%;
      }
    }
  }
}
</style>
