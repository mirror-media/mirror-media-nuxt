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
          :validateOn="validateOn"
        />
        <SubscribeFormOrdererData
          ref="receiverDOM"
          type="收件人"
          :setOrdererData="setOrdererData"
          :setFormStatus="setFormStatus"
          :validateOn="validateOn"
          :receiverDataIsSameAsOrderer="receiverDataIsSameAsOrderer"
          :setReceiverDataIsSameAsOrderer="setReceiverDataIsSameAsOrderer"
        />

        <SubscribeFormShip :setShipPlan="setShipPlan" />
        <SubscribeFormReceipt
          ref="receiptDOM"
          :setReceiptData="setReceiptData"
        />

        <SubscribeFormAcceptPermission
          ref="permissionDOM"
          v-model="acceptPermission"
        />
        <SubscribeFormCreditCard />

        <UiSubscribeButton title="確認訂購" @click.native="submitHandler" />
      </div>
      <div class="subscribe-form__right">
        <SubscribeFormPerchaseInfo
          :price="price"
          :shipping="shipping"
          :total="total"
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
import SubscribeFormAcceptPermission from '~/components/SubscribeFormAcceptPermission.vue'
import SubscribeFormCreditCard from '~/components/SubscribeFormCreditCard.vue'
import UiSubscribeButton from '~/components/UiSubscribeButton.vue'
export default {
  components: {
    SubscribeFormPlanList,
    SubscribeFormPerchaseInfo,
    SubscribeFormOrdererData,
    SubscribeFormShip,
    SubscribeFormReceipt,
    SubscribeFormAcceptPermission,
    SubscribeFormCreditCard,
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
    validateOn: {
      // for testing
      type: Boolean,
      default: true,
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
      receiptData: {
        receiptPlan: '捐贈',
        donateOrganization: '財團法人伊甸社會福利基金會',
        carrierType: 'mail',
        carrierNumber: '',
        carrierTitle: '',
        carrierUbn: '',
      },
      creditCard: {
        card: '',
        date: '',
        cvv: '',
      },
      receiverDataIsSameAsOrderer: false,
      acceptPermission: false,
      formStatus: {
        orderer: 'OK',
        receiver: 'OK',
      },
    }
  },
  computed: {
    perchasedItems() {
      const items = this.perchasedPlan.map((plan) => {
        return {
          name: plan.detail,
          amount: plan.count,
          price: plan.newPrice,
        }
      })

      return items
    },
    price() {
      const reducer = (accumulator, currentValue) => {
        return (
          accumulator.newPrice * accumulator.count +
          currentValue.newPrice * currentValue.count
        )
      }

      return this.perchasedPlan.reduce(reducer)
    },
    shipping() {
      return this.shipPlan?.cost || 0
    },
    total() {
      return this.price + this.shipping
    },
  },
  methods: {
    setShipPlan(choosedShipPlan) {
      this.shipPlan = choosedShipPlan
    },
    setReceiptData(editedReceiptData) {
      this.receiptData = editedReceiptData
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
    getOrderPayload() {
      return {
        // 商品相關
        items: this.perchasedItems,
        discount_code: this.discount.code,

        // 購買者相關
        pur_name: this.ordererData.name,
        pur_cell: this.ordererData.cellphone,
        pur_phone: `${this.ordererData.phone} ${this.ordererData.phoneExt}`,
        pur_addr: this.ordererData.address,
        pur_mail: this.ordererData.email,

        // 收貨相關
        rec_name: this.receiverData.name,
        rec_cell: this.receiverData.cellphone,
        rec_phone: `${this.receiverData.phone} ${this.receiverData.phoneExt}`,
        rec_addr: this.receiverData.address,
        rec_remark: '', // TODO
        delivery: this.shipPlan.name,

        // 付款相關
        prime_token: '',
        price_total: this.total,

        // 發票相關
        carrier_type: this.receiptData.carrierType,
        carrier_number: this.receiptData.carrierNumber,
        carrier_title: this.receiptData.carrierTitle,
        carrier_ubn: this.receiptData.carrierUbn,
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
      this.$refs.permissionDOM.check()
      if (this.receiverDataIsSameAsOrderer) {
        this.receiverData = this.ordererData
      }

      if (this.validationPass() && this.acceptPermission) {
        const payload = this.getOrderPayload()

        // console.log(payload)
        this.proceedOrderPayment(payload)
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

    &.radio {
      margin-bottom: 0;
    }
  }
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

  input[type='text'] {
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

    &:disabled {
      background: #ebebeb;
    }
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

  .error {
    animation-name: errorShake;
    animation-duration: 0.3s;
    input {
      border: solid 2px rgba(232, 24, 49, 0.5);
    }

    &__message {
      margin-top: 3px;
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
}
</style>
