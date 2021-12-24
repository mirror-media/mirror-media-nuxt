<template>
  <div class="subscribe-form">
    <div class="subscribe-form__wrapper">
      <div class="subscribe-form__left">
        <SubscribeFormPlanList
          :perchasedPlan="perchasedPlan"
          :discount="discount"
          :setHasCode="setHasCode"
        />
        <SubscribeFormOrdererData
          ref="ordererDOM"
          type="訂購人"
          :ordererData="ordererData"
          :setOrdererData="setOrdererData"
          :validateOn="validateOn"
          :setFormStatus="setFormStatus"
        />
        <SubscribeFormOrdererData
          ref="receiverDOM"
          type="收件人"
          :ordererData="ordererData"
          :setOrdererData="setOrdererData"
          :receiverDataIsSameAsOrderer="receiverDataIsSameAsOrderer"
          :setReceiverDataIsSameAsOrderer="setReceiverDataIsSameAsOrderer"
          :validateOn="validateOn"
          :setFormStatus="setFormStatus"
        />

        <SubscribeFormShip ref="shipDOM" :setShipPlan="setShipPlan" />
        <SubscribeFormReceipt
          ref="receiptDOM"
          :setReceiptData="setReceiptData"
          :validateOn="validateOn"
          :setFormStatus="setFormStatus"
        />

        <SubscribeFormAcceptPermission
          ref="permissionDOM"
          v-model="acceptPermission"
        />

        <UiSubscribeButton title="確認訂購" @click.native="submitHandler" />
      </div>
      <div class="subscribe-form__right">
        <SubscribeFormPerchaseInfo
          :price="price"
          :shipping="shipping"
          :total="total"
          :discount="discountPrice"
        />
        <SubscribeDiscount
          v-for="discount in discountList"
          :key="discount.title"
          :discount="discount"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SubscribeDiscount from '~/components/SubscribeDiscount.vue'
import SubscribeFormPlanList from '~/components/SubscribeFormPlanList.vue'
import SubscribeFormPerchaseInfo from '~/components/SubscribeFormPerchaseInfo.vue'
import SubscribeFormOrdererData from '~/components/SubscribeFormOrdererData.vue'
import SubscribeFormShip from '~/components/SubscribeFormShip.vue'
import SubscribeFormReceipt from '~/components/SubscribeFormReceipt.vue'
import SubscribeFormAcceptPermission from '~/components/SubscribeFormAcceptPermission.vue'
import UiSubscribeButton from '~/components/UiSubscribeButton.vue'
export default {
  components: {
    SubscribeDiscount,
    SubscribeFormPlanList,
    SubscribeFormPerchaseInfo,
    SubscribeFormOrdererData,
    SubscribeFormShip,
    SubscribeFormReceipt,
    SubscribeFormAcceptPermission,
    UiSubscribeButton,
  },
  props: {
    currentChoosedPlanId: {
      type: Number,
      default: 0,
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
      perchasedPlan: [
        {
          id: 0,
          title: '一年方案',
          detail: '一年鏡週刊 52 期',
          originalPrice: 3990,
          newPrice: 2880,
          count: this.currentChoosedPlanId === 0 ? 1 : 0,
        },
        {
          id: 1,
          title: '二年方案',
          detail: '二年鏡週刊 104 期',
          originalPrice: 7800,
          newPrice: 5280,
          count: this.currentChoosedPlanId === 1 ? 1 : 0,
        },
      ],
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
        name: '一般配送',
        cost: 0,
      },
      receiptData: {
        receiptPlan: '捐贈',
        donateOrganization: '',
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
        receipt: 'OK',
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
    discountPrice() {
      let count
      this.perchasedPlan.map((plan) => {
        if (plan.count !== 0) {
          count = plan.count
        }
      })
      return this.discount.hasCode ? 80 * count : 0
    },
    shipping() {
      let year, count
      this.perchasedPlan.map((plan) => {
        if (plan.count !== 0) {
          count = plan.count
          year = plan.title === '二年方案' ? 2 : 1
        }
      })
      return this.shipPlan?.cost * year * 52 * count || 0
    },
    total() {
      return this.price + this.shipping - this.discountPrice
    },
    discountList() {
      let title
      this.perchasedPlan.map((plan) => {
        if (plan.count !== 0) {
          title = plan.title
        }
      })
      const year = title === '二年方案' ? 2 : 1
      const discountList = [
        { title: `符合${title}優惠`, content: `贈送 ${year * 5} 期` },
      ]
      if (this.discount.hasCode) {
        discountList.push({ title: '符合續訂優惠', content: `贈送 ${year} 期` })
      }
      return discountList
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
    setHasCode(newSataus) {
      this.discount.hasCode = newSataus
    },
    generateCarrierInt(carrierType) {
      if (this.receiptData.donateOrganization) {
        return undefined
      }

      switch (carrierType) {
        case 'mail':
          return '2'

        case '手機條碼':
          return '0'

        case '自然人憑證':
          return '1'
      }
    },
    generateItemData() {
      let itemDest = '一年鏡週刊52期'
      let amount = 1
      let price = 2880

      this.perchasedPlan.forEach((item) => {
        if (item.count > 0) {
          itemDest = item.detail
          amount = item.count
          price = item.newPrice
        }
      })

      return {
        itemDest,
        amount,
        price,
      }
    },
    getOrderPayload() {
      const { itemDest, amount } = this.generateItemData()

      return {
        data: {
          desc: itemDest,
          comment: 'mock_comment',
          merchandise: {
            connect: {
              code: 'mg_yearly',
            },
          },
          itemCount: amount,
          purchaseDatetime: new Date(),
          purchaseName: this.ordererData.name,
          purchaseAddress: this.ordererData.address,
          purchaseEmail: this.ordererData.email,
          receiveName: this.receiverData.name,
          receiveAddress: this.receiverData.address,
          category: 'B2C',
          purchaseMobile: 'mock_purchase_mobile',
          receiveMobile: 'mock_receive_mobile',
          loveCode: parseInt(this.receiptData.donateOrganization),
          carrierType: '',
        },
      }

      // return {
      //   // 商品相關
      //   // items: this.perchasedItems,

      //   discountCode: this.discount.code,
      //   discount: this.discountPrice,

      //   // 購買者相關
      //   purName: this.ordererData.name,
      //   purCell: this.ordererData.cellphone,
      //   purPhone: `${this.ordererData.phone} ${this.ordererData.phoneExt}`,
      //   purAddr: this.ordererData.address,
      //   purMail: this.ordererData.email,
      //   Email: this.ordererData.email,

      //   // 收貨相關
      //   recName: this.receiverData.name,
      //   recCell: this.receiverData.cellphone,
      //   recPhone: `${this.receiverData.phone} ${this.receiverData.phoneExt}`,
      //   recAddr: this.receiverData.address,
      //   recRemark: '', // TODO
      //   delivery: this.shipPlan.name,
      //   deliveryCost: this.shipping,

      //   // 付款相關
      //   primeToken: '',
      //   priceTotal: this.total,

      //   // 發票相關
      //   carrierType: this.generateCarrierInt(this.receiptData.carrierType),
      //   carrierNumber: this.receiptData.carrierNumber,
      //   carrierTitle: this.receiptData.carrierTitle,
      //   carrierUbn: this.receiptData.carrierUbn,

      //   // 捐贈發票
      //   loveCode: this.receiptData.donateOrganization,
      // }
    },
    validationPass() {
      const validateArray = Object.values(this.formStatus)
      const result = validateArray.find((item) => item !== 'OK')
      if (result) {
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
      this.$refs.receiptDOM.check()
      this.$refs.permissionDOM.check()

      if (this.receiverDataIsSameAsOrderer) {
        this.receiverData = this.ordererData
      }

      if (this.validationPass() && this.acceptPermission) {
        const payload = this.getOrderPayload()
        // const str = JSON.stringify(payload)
        // console.log(str)
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

    &:first-child {
      margin-bottom: 60px;
      color: red;
    }

    & > div {
      margin-bottom: 48px;
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
    font-size: 22px;
    line-height: 34px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    margin-bottom: 12px;

    @include media-breakpoint-up(sm) {
      font-size: 24px;
      line-height: 31px;
    }
  }

  span {
    display: block;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #4a4a4a;
    margin-bottom: 6px;

    @include media-breakpoint-up(sm) {
      font-size: 18px;
    }

    &.radio {
      margin-bottom: 0;
    }
  }

  input[type='text'] {
    height: 48px;
    width: 100%;
    padding: 12px;
    border-radius: 2px;
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.3);
    font-size: 18px;
    line-height: 25px;
    color: rgba(0, 0, 0, 0.87);

    &:focus {
      outline: none;
      border: 1px solid rgba(0, 0, 0, 0.87);
    }

    &:disabled {
      background: #e3e3e3;
      border: 1px solid rgba(0, 0, 0, 0.2);
      color: rgba(0, 0, 0, 0.2);
      font-size: 18px;
      line-height: 25px;
      &::placeholder {
        color: rgb(227, 227, 227);
      }
    }

    &::placeholder {
      font-size: 18px;
      line-height: 25px;
      color: rgba(0, 0, 0, 0.3);
    }
  }

  input[type='checkbox'] {
    width: 20px;
    height: 20px;
    border-radius: 2px;
    box-shadow: inset 1px 1px 1px 0 rgba(0, 0, 0, 0.2);
    background-color: #f5f5f5;
    margin-right: 8px;
    color: #054f77;
  }

  input[type='radio'] {
    width: 20px;
    height: 20px;
    padding: 6px;
    border-radius: 11px;
    background-color: #f5f5f5;
    color: #04295e;
  }

  .error {
    animation-name: errorShake;
    animation-duration: 0.3s;
    input,
    select {
      border: 1px solid #e51731;
    }

    &__message {
      margin-top: 8px;
      color: #e51731 !important;
      font-size: 16px;
      line-height: 150%;
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

.subcribe-button span {
  color: #fff !important;
}
</style>
