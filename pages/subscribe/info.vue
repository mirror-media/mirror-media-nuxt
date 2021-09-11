<template>
  <div class="subscribe-info">
    <SubscribeStepProgress :currentStep="2" />

    <div class="subscribe-info__form">
      <div class="subscribe-info__form_wrapper">
        <div class="subscribe-info__form_left">
          <MembershipFormPlanList
            :perchasedPlan="perchasedPlan"
            @back="handleBack"
          />
          <div
            class="subscribe-info__form_left_email"
            :class="{ error: $v.email.$error }"
          >
            <h1 class="subscribe-info__form_left_email_title">電子信箱</h1>
            <p class="subscribe-info__form_left_email_description">
              我們會將訂單資訊寄至信箱給您。若您更改信箱，我們將一併更改您個人資料的聯絡信箱。
            </p>
            <input
              v-model="email"
              type="text"
              placeholder="name@example.com"
              @input="$v.email.$touch"
            />
            <span
              v-show="!$v.email.email && $v.email.$error"
              class="error__message"
              >請輸入有效的 Email 地址</span
            >
            <span
              v-show="!$v.email.required && $v.email.$error"
              class="error__message"
              >電子郵件不得為空</span
            >
          </div>
          <SubscribeFormReceipt
            ref="receiptDOM"
            :setReceiptData="setReceiptData"
            :validateOn="validateOn"
            :setFormStatus="setFormStatus"
          />
          <p class="subscribe-info__form_left_hint">
            按下開始結帳後，頁面將會跳離，抵達由藍新金流 NewebPay
            所提供的線上結帳頁面，完成後將會再跳回到鏡週刊
          </p>
          <UiSubscribeButton title="開始結帳" @click.native="submitHandler" />
        </div>
        <div class="subscribe-info__form_right">
          <MembershipFormPerchaseInfo
            :perchasedPlan="perchasedPlan"
            :showTitle="true"
          />
        </div>
      </div>
    </div>
    <MembershipInfoSim
      v-if="showSimFormStatus"
      :validateOn="validateOn"
      :setValidateOn="setValidateOn"
      :orderStatus="orderStatus"
      :setOrderStatus="setOrderStatus"
    />
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
import { ENV } from '~/configs/config'
import SubscribeStepProgress from '~/components/SubscribeStepProgress.vue'
import MembershipInfoSim from '~/components/MembershipInfoSim.vue'
import MembershipFormPlanList from '~/components/MembershipFormPlanList.vue'
import MembershipFormPerchaseInfo from '~/components/MembershipFormPerchaseInfo.vue'
import SubscribeFormReceipt from '~/components/SubscribeFormReceipt.vue'
import UiSubscribeButton from '~/components/UiSubscribeButton.vue'
import { useMemberSubscribeMachine } from '~/xstate/member-subscribe/compositions'

export default {
  components: {
    SubscribeStepProgress,
    MembershipInfoSim,
    MembershipFormPlanList,
    MembershipFormPerchaseInfo,
    SubscribeFormReceipt,
    UiSubscribeButton,
  },
  setup() {
    const { state, send } = useMemberSubscribeMachine()
    return {
      stateMembershipSubscribe: state,
      sendMembershipSubscribe: send,
    }
  },
  data() {
    return {
      perchasedPlan: [
        {
          id: 1,
          detail: '鏡週刊 Premium 會員 (月方案)',
          price: 99,
          newPrice: 49,
        },
      ],
      email: '',
      receiptData: {
        receiptPlan: '捐贈',
        donateOrganization: '',
        carrierType: 'mail',
        carrierNumber: '',
        carrierTitle: '',
        carrierUbn: '',
      },
      orderStatus: 'success', //  fail, success
      validateOn: true,
      formStatus: {
        receipt: 'OK',
      },
    }
  },
  validations: {
    email: {
      email,
      required,
    },
  },
  computed: {
    showSimFormStatus() {
      return ENV === 'local'
    },
    frequency() {
      // workaround
      const planDetail = this.perchasedPlan?.[0]?.detail
      switch (planDetail) {
        case '鏡週刊 Premium 會員 (年方案)':
          return 'yearly'

        case '鏡週刊 Premium 會員 (月方案)':
          return 'monthly'

        default:
          return 'one_time'
      }
    },
  },
  methods: {
    handleBack() {
      this.$router.push('/subscribe')
    },
    setValidateOn() {
      this.validateOn = !this.validateOn
    },
    setReceiptData(editedReceiptData) {
      this.receiptData = editedReceiptData
    },
    setFormStatus(type, formStatus) {
      this.formStatus[type] = formStatus
    },
    setOrderStatus(val) {
      this.orderStatus = val
    },
    async submitHandler(e) {
      e.preventDefault()
      this.$refs.receiptDOM.check()
      this.$v.email.$touch()
      console.log(this.orderStatus)
      if (
        this.validateOn &&
        (this.$v.email.$error || this.formStatus.receipt !== 'OK')
      )
        return

      // emit apiGateWay
      const result = await this.getPaymentDataFromApiGateWay()

      // TOTO: encrypt
      console.log(result)

      // TODO: fire form post

      if (this.orderStatus === 'success')
        return this.sendMembershipSubscribe('付款成功')
      this.sendMembershipSubscribe('付款失敗')
    },
    async getPaymentDataFromApiGateWay() {
      let gateWayPayload
      const isPremiumPurchase =
        this.frequency === 'yearly' || this.frequency === 'monthly'

      if (isPremiumPurchase) {
        gateWayPayload = {
          email: this.email,
          frequency: 'monthly',
          paymentMethod: 'newebpay',
          status: 'paying',
          promoteId: 12345, // 折扣碼
        }
      } else {
        // one_time
        gateWayPayload = {
          email: this.email,
          paymentMethod: 'newebpay',
          status: 'paying',
          promoteId: 12345, // 折扣碼
          postId: 'qwerty',
        }
      }
      const { data } = await this.$getPaymentDataOfSubscription(gateWayPayload)
      return data
    },
  },
  async created() {
    // ======To Kevin Start=======
    const isMemberCheckedServiceRule = await this.$getMemberServiceRuleStatus(
      this
    )
    console.log(isMemberCheckedServiceRule)

    // ======To Kevin End=======
  },
}
</script>

<style lang="scss" scoped>
.subscribe-info {
  position: relative;
  &__loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    &_icon {
      width: 100px;
      height: 100px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  &__form {
    padding: 10px 8px;
    @include media-breakpoint-up(md) {
      padding: 40px 8px;
    }

    &_wrapper {
      max-width: 850px;
      margin: auto;
      display: flex;
      flex-direction: column-reverse;
      @include media-breakpoint-up(md) {
        flex-direction: row;
      }
      @include media-breakpoint-up(lg) {
        max-width: 991px;
      }
    }

    &_left {
      width: 100%;
      flex: 2;
      flex-shrink: 0;
      margin-right: 41px;
      @include media-breakpoint-up(md) {
        max-width: 550px;
      }

      div:first-child {
        @include media-breakpoint-up(md) {
          margin-bottom: 60px;
        }
      }

      & > div {
        margin-bottom: 48px;
      }

      & > .subcribe-button {
        max-width: 490px;
        margin: auto;
      }

      &_email {
        &_title {
          margin-bottom: 8px;
          color: rgba(0, 0, 0, 0.87);
          font-size: 22px;
          line-height: 31px;
          @include media-breakpoint-up(md) {
            font-size: 24px;
            line-height: 34px;
            margin-bottom: 5px;
          }
        }

        &_description {
          margin-bottom: 12px;
          font-size: 16px;
          line-height: 150%;
          color: rgba(0, 0, 0, 0.66);
        }
      }

      &_hint {
        font-size: 16px;
        line-height: 150%;
        color: rgba(0, 0, 0, 0.5);
        margin: 24px 0;
      }
    }

    &_right {
      width: 100%;
      flex: 1;
      margin-bottom: 28px;

      @include media-breakpoint-up(md) {
        max-width: 400px;
      }
    }
  }
}

/deep/ {
  .receipt {
    margin-bottom: 24px !important;
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

  .subscribe-form__title {
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
}
</style>
