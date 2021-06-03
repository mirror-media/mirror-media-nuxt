<template>
  <div class="subscribe-form">
    <div class="subscribe-form__wrapper">
      <div class="subscribe-form__left">
        <SubscribeFormPlanList
          :perchasedPlan="perchasedPlan"
          :discount="discount"
        />
        <SubscribeFormOrdererData
          ref="ordererDOM"
          type="訂購人"
          :setOrdererData="setOrdererData"
          :setFormStatus="setFormStatus"
        />
        <SubscribeFormOrdererData
          ref="receiverDOM"
          type="收件人"
          :setOrdererData="setOrdererData"
          :setFormStatus="setFormStatus"
          :receiverDataIsSameAsOrderer="receiverDataIsSameAsOrderer"
          :setReceiverDataIsSameAsOrderer="setReceiverDataIsSameAsOrderer"
        />

        <SubscribeFormShip :setShipPlan="setShipPlan" />
        <SubscribeFormReceipt :setReceiptPlan="setReceiptPlan" />

        <UiSubscribeButton title="確認訂購" @click.native="submitHandler" />
      </div>
      <div class="subscribe-form__right">
        <SubscribeFormPerchaseInfo
          :perchasedPlan="perchasedPlan"
          :shipPlan="shipPlan"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SubscribeFormPlanList from '~/components/SubscribeFormPlanList.vue'
import SubscribeFormPerchaseInfo from '~/components/SubscribeFormPerchaseInfo.vue'
import SubscribeFormOrdererData from '~/components/SubscribeFormOrdererData.vue'
import SubscribeFormShip from '~/components/SubscribeFormShip.vue'
import SubscribeFormReceipt from '~/components/SubscribeFormReceipt.vue'
import UiSubscribeButton from '~/components/UiSubscribeButton.vue'
export default {
  components: {
    SubscribeFormPlanList,
    SubscribeFormPerchaseInfo,
    SubscribeFormOrdererData,
    SubscribeFormShip,
    SubscribeFormReceipt,
    UiSubscribeButton,
  },
  props: {
    perchasedPlan: {
      type: Array,
      isRequired: true,
      default: () => {
        return [
          {
            id: 0,
            title: '一年方案',
            detail: '一年鏡週刊52期，加購5期方案',
            originalPrice: 3990,
            newPrice: 2880,
            count: 0,
          },
          {
            id: 1,
            title: '二年方案',
            detail: '二年鏡週刊104期，加購10期方案',
            originalPrice: 7800,
            newPrice: 5280,
            count: 0,
          },
        ]
      },
    },
    proceedOrderPayment: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      discount: {
        hasCode: false,
        code: '',
      },
      ordererData: {
        name: '',
        cellphone: '',
        phone: '',
        phoneExt: '',
        address: '',
        email: '',
      },
      receiverData: {
        name: '',
        cellphone: '',
        phone: '',
        phoneExt: '',
        address: '',
        email: '',
      },
      shipPlan: {
        name: '限時專送',
        cost: 0,
      },
      receiptPlan: '捐贈',
      receiverDataIsSameAsOrderer: false,
      formStatus: {
        orderer: 'OK',
        receiver: 'OK',
      },
    }
  },
  methods: {
    setShipPlan(choosedShipPlan) {
      this.shipPlan = choosedShipPlan
    },
    setReceiptPlan(choosedReceiptPlan) {
      this.receiptPlan = choosedReceiptPlan
    },
    setOrdererData(newOrdererData) {
      this.ordererData = newOrdererData
    },
    setReceiverDataIsSameAsOrderer() {
      this.receiverDataIsSameAsOrderer = !this.receiverDataIsSameAsOrderer
    },
    setFormStatus(type, formStatus) {
      this.formStatus[type] = formStatus
    },
    getOrderInfo() {
      return {
        perchasedPlan: this.perchasedPlan,
        discount: this.discount,
        ordererData: this.ordererData,
        receiverData: this.receiverData,
        shipPlan: this.shipPlan,
        receiptPlan: this.receiptPlan,
      }
    },
    validationPass() {
      const validateArray = Object.values(this.formStatus)
      if (validateArray.find((item) => item !== 'OK')) {
        return false
      } else {
        return true
      }
    },
    submitHandler(e) {
      e.preventDefault()
      if (this.receiverDataIsSameAsOrderer) {
        this.receiverData = this.ordererData
      }

      // check form's validationStatus
      this.ordererData = this.$refs.ordererDOM.check()
      this.receiverData = this.$refs.receiverDOM.check()
      if (this.receiverDataIsSameAsOrderer) {
        this.receiverData = this.ordererData
      }

      if (this.validationPass) {
        this.proceedOrderPayment(this.getOrderInfo)
      }
    },
  },
}
</script>

<style lang="scss">
.subscribe-form {
  padding: 10px 8px;
  @include media-breakpoint-up(sm) {
  }
  @include media-breakpoint-up(md) {
    padding: 40px 8px;
  }
  &__wrapper {
    max-width: 850px;
    margin: auto;
    display: flex;
    flex-direction: column-reverse;

    @include media-breakpoint-up(sm) {
    }
    @include media-breakpoint-up(md) {
      flex-direction: row;
    }
    @include media-breakpoint-up(lg) {
      max-width: 991px;
    }
  }

  &__left {
    width: 100%;
    flex: 2;
    flex-shrink: 0;
    margin-right: 41px;
    @include media-breakpoint-up(md) {
      max-width: 550px;
    }

    & > div {
      margin-bottom: 42px;
    }

    & > .subcribe-button {
      max-width: 490px;
      margin: auto;
    }
  }

  &__right {
    width: 100%;
    flex: 1;
    margin-bottom: 26px;

    @include media-breakpoint-up(md) {
      max-width: 400px;
    }
  }

  &__title {
    font-size: 26px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #4a4a4a;
    margin-bottom: 16px;
  }

  input[type='checkbox'] {
    width: 22px;
    height: 22px;
    border-radius: 2px;
    box-shadow: inset 1px 1px 1px 0 rgba(0, 0, 0, 0.2);
    background-color: #f5f5f5;
    margin-right: 8px;
  }

  input[type='radio'] {
    width: 22px;
    height: 22px;
    padding: 6px;
    border-radius: 11px;
    background-color: #f5f5f5;
  }
}
</style>
