<template>
  <div class="payment">
    <h2 class="subscribe-form__title">付款方式</h2>

    <p
      v-show="isNeedToCheck && paymentFormStatus === 'ERROR'"
      class="payment__error"
    >
      以下尚未勾選
    </p>
    <div class="payment__choose">
      <div class="payment__choose_item">
        <UiSubscribeRadioInput
          v-model="paymentMethod"
          radioValue="newebpay"
          radioName="信用卡付款"
          :isValid="isValid"
        />
      </div>

      <div class="payment__choose_item">
        <UiSubscribeRadioInput
          v-model="paymentMethod"
          radioValue="linepay"
          radioName="LINE Pay"
          :frequency="frequency"
          :isValid="isValid"
        />
      </div>
    </div>
  </div>
</template>

<script>
import UiSubscribeRadioInput from '~/components/UiSubscribeRadioInput.vue'

export default {
  components: {
    UiSubscribeRadioInput,
  },
  props: {
    setPaymentMethod: {
      type: Function,
      isRequired: true,
      default: () => {},
    },
    validateOn: {
      // for testing
      type: Boolean,
      default: true,
    },
    setFormStatus: {
      type: Function,
      default: () => {},
    },
    frequency: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      paymentMethod: '',
      submitStatus: null,
      paymentFormStatus: 'OK',
    }
  },

  computed: {
    isNeedToCheck() {
      return this.validateOn
    },
    isValid() {
      return this.paymentFormStatus === 'OK'
    },
  },
  watch: {
    paymentMethod(val) {
      this.setPaymentMethod(val)
      this.check()
    },
  },
  methods: {
    check() {
      const valid = ['newebpay', 'linepay'].includes(this.paymentMethod)
      this.paymentFormStatus = valid ? 'OK' : 'ERROR'
      this.setFormStatus('payment', this.paymentFormStatus)
    },
  },
}
</script>

<style lang="scss" scoped>
.payment {
  font-size: 16px;
  line-height: 1.87;
  color: #000000a8;
  padding: 0 calc(25px - 8px);

  @include media-breakpoint-up(md) {
    padding: 0;
  }

  &__detail {
    margin-bottom: 20px;
    @include media-breakpoint-up(sm) {
      margin-bottom: 23px;
    }
  }

  &__error {
    font-size: 16px;
    line-height: 150%;
    color: #e51731;
    margin-bottom: 8px;
  }

  &__choose {
    font-size: 18px;
    line-height: normal;

    &_item {
      margin-bottom: 21px;
    }
  }
}
</style>
