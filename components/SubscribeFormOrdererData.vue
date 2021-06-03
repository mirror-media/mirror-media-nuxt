<template>
  <div class="orderer-data">
    <h2 class="subscribe-form__title">{{ type }}</h2>

    <div v-if="!isOrderer" class="orderer-data__check">
      <input type="checkbox" :value="disable" @change="setDisable" /><span
        >同訂購人資訊</span
      >
    </div>

    <div
      class="orderer-data__input_wrapper half"
      :class="{ error: $v.name.$error && isNeedToCheck }"
    >
      <span>姓名</span>
      <input v-model.trim="$v.name.$model" type="text" :disabled="disable" />
      <span
        v-if="!$v.name.required && $v.name.$error && isNeedToCheck"
        class="error__message"
        >Required</span
      >
    </div>

    <div class="phone">
      <div
        class="orderer-data__input_wrapper phone__cellphone"
        :class="{ error: $v.cellphone.$error && isNeedToCheck }"
      >
        <span>手機</span>
        <input
          v-model.trim="$v.cellphone.$model"
          :disabled="disable"
          type="text"
        />
        <span
          v-if="!$v.cellphone.required && $v.cellphone.$error && isNeedToCheck"
          class="error__message"
          >Required</span
        >
      </div>

      <div class="orderer-data__input_wrapper phone__phone">
        <span>市話（非必填）</span>
        <div class="orderer-data__input_wrapper multi">
          <input
            v-model="phone"
            :disabled="disable"
            class="multi__phone"
            type="text"
          />
          <span>-</span>
          <input
            v-model="phoneExt"
            :disabled="disable"
            class="multi__ext"
            type="text"
            placeholder="EXT"
          />
        </div>
      </div>
    </div>

    <div
      class="orderer-data__input_wrapper"
      :class="{ error: $v.address.$error && isNeedToCheck }"
    >
      <span>通訊地址</span>
      <input v-model.trim="$v.address.$model" :disabled="disable" type="text" />
      <span
        v-if="!$v.address.required && $v.address.$error && isNeedToCheck"
        class="error__message"
        >Required</span
      >
    </div>

    <div
      v-if="isOrderer"
      class="orderer-data__input_wrapper"
      :class="{ error: $v.email.$error && isNeedToCheck }"
    >
      <span>電子信箱</span>
      <input v-model.trim="$v.email.$model" :disabled="disable" type="text" />
      <span
        v-if="!$v.email.email && $v.email.$error && isNeedToCheck"
        class="error__message"
        >email format error</span
      >
    </div>
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'

export default {
  props: {
    type: {
      type: String,
      isRequired: true,
      default: '訂購人',
    },
    setOrdererData: {
      type: Function,
      default: () => {},
    },
    setFormStatus: {
      type: Function,
      default: () => {},
    },
    receiverDataIsSameAsOrderer: {
      type: Boolean,
      default: false,
    },
    setReceiverDataIsSameAsOrderer: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      validateOn: false, // for development
      submitStatus: null,
      validateSwitch: true,
      name: '',
      cellphone: '',
      phone: '',
      phoneExt: '',
      address: '',
      email: '',
    }
  },
  validations: {
    name: {
      required,
    },
    cellphone: {
      required,
    },
    address: {
      required,
    },
    email: {
      email,
      required,
    },
  },

  computed: {
    disable() {
      return this.receiverDataIsSameAsOrderer
    },
    isOrderer() {
      return this.type !== '收件人'
    },
    isNeedToCheck() {
      return !this.receiverDataIsSameAsOrderer && this.validateOn
    },
    getFormType() {
      switch (this.type) {
        case '訂購人':
          return 'orderer'
        case '收件人':
          return 'receiver'
        default:
          return 'orderer'
      }
    },
  },

  methods: {
    setDisable(e) {
      e.preventDefault()
      this.setReceiverDataIsSameAsOrderer(!this.receiverDataIsSameAsOrderer)
    },
    check() {
      if (this.isNeedToCheck) {
        this.$v.$touch()
        if (this.$v.$invalid) {
          this.submitStatus = 'ERROR'
        } else {
          this.submitStatus = 'OK'
        }
      } else {
        this.submitStatus = 'OK'
      }

      this.setFormStatus(this.getFormType, this.submitStatus)

      // after check, feed formData to parent
      return {
        name: this.name,
        cellphone: this.cellphone,
        phone: this.phone,
        phoneExt: this.phoneExt,
        address: this.address,
        email: this.email,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.orderer-data {
  position: relative;
  padding: 0 calc(25px - 8px);

  @include media-breakpoint-up(md) {
    padding: 0;
  }

  &__check {
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    span {
      font-size: 18px;
      color: #4a4a4a;
    }
  }

  &__input_wrapper {
    margin-bottom: 11px;
    width: 100%;

    &.half {
      width: 180px;

      @include media-breakpoint-up(md) {
        width: calc((100% - 30px) / 2);
      }
    }

    &.phone {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      @include media-breakpoint-up(md) {
        flex-direction: row;
      }

      &__cellphone {
        width: 180px;
        @include media-breakpoint-up(md) {
          width: calc((100% - 30px) / 2);
        }
      }

      &__phone {
        width: 270px;
        @include media-breakpoint-up(md) {
          width: calc((100% - 30px) / 2);
        }
      }
    }

    .multi {
      display: flex;
      align-items: center;

      & > input {
        margin-right: 4px;

        &:last-child {
          margin-left: 4px;
          margin-right: 0;
        }
      }

      &__phone {
        width: 180px;
      }

      // &__ext {
      //   width: 72px;
      // }
    }

    span {
      display: block;
      font-size: 15px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #4a4a4a;
      margin-bottom: 6px;
    }

    input {
      height: 44px;
      width: 100%;
      padding: 11px 7px 11px;
      border-radius: 4px;
      box-shadow: inset 1px 1px 1px 0 rgba(0, 0, 0, 0.1);
      background: #f5f5f5;

      &:focus {
        outline: none;
      }

      &:disabled {
        background: #ebebeb;
      }
    }
  }
}

.error {
  animation-name: errorShake;
  animation-duration: 0.3s;
  input {
    border: solid 2px rgba(232, 24, 49, 0.5);
  }

  &__message {
    color: rgba(232, 24, 49, 0.5) !important;
  }
}
@keyframes errorShake {
  0% {
    transform: translateX(0);
  }
  30% {
    transform: translateX(3%);
  }
  60% {
    transform: translateX(-3%);
  }
  90% {
    transform: translateX(0);
  }
}
</style>
