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
            v-if="!isMonthUpgradeToYear"
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
            v-if="!isMonthUpgradeToYear"
            ref="receiptDOM"
            :setReceiptData="setReceiptData"
            :validateOn="validateOn"
            :setFormStatus="setFormStatus"
          />
          <p class="subscribe-info__form_left_hint">
            按下開始結帳後，頁面將會跳離，抵達由藍新金流 NewebPay
            所提供的線上結帳頁面，完成後將會再跳回到鏡週刊
          </p>
          <UiSubscribeButton
            v-if="isMonthUpgradeToYear"
            title="更新訂閱"
            @click.native="updateHandler"
            :isLoading="isLoading"
          />
          <UiSubscribeButton
            v-else
            title="開始結帳"
            @click.native="submitHandler"
            :isLoading="isLoading"
          />
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
import qs from 'qs'
import NewebPay from '@mirrormedia/newebpay-node'
import { required, email } from 'vuelidate/lib/validators'
import SubscribeStepProgress from '~/components/SubscribeStepProgress.vue'
import { ENV, NEWEBPAY_KEY, NEWEBPAY_IV } from '~/configs/config'
import MembershipInfoSim from '~/components/MembershipInfoSim.vue'
import MembershipFormPlanList from '~/components/MembershipFormPlanList.vue'
import MembershipFormPerchaseInfo from '~/components/MembershipFormPerchaseInfo.vue'
import SubscribeFormReceipt from '~/components/SubscribeFormReceipt.vue'
import UiSubscribeButton from '~/components/UiSubscribeButton.vue'
import { useMemberSubscribeMachine } from '~/xstate/member-subscribe/compositions'
import { formatMemberType } from '~/utils/memberSubscription'
export default {
  middleware: ['handle-go-to-marketing'],
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
    const perchasedPlan = usePerchasedPlan()
    return {
      stateMembershipSubscribe: state,
      sendMembershipSubscribe: send,
      perchasedPlan,
    }

    function usePerchasedPlan() {
      const { state } = useMemberSubscribeMachine()
      const prefix = '會員訂閱功能.方案購買流程.確認訂購頁.確認訂購表單頁'

      if (state?.value?.matches(`${prefix}.準備單篇訂閱`)) {
        return [
          {
            id: state.value.context.subscriptionOrderOneTimePostId,
            detail: '鏡週刊Basic會員（單篇）',
            hint: '單篇 $1 元，享 14 天內無限次觀看',
            price: '原價 NT$1',
            newPrice: 1,
            key: 'basic',
          },
        ]
      } else if (state?.value?.matches(`${prefix}.準備月訂閱`)) {
        return [
          {
            id: 1,
            detail: '鏡週刊Premium會員（月方案）',
            hint: '每月 $49 元，信用卡自動續扣',
            price: '原價 NT$99',
            newPrice: 49,
            key: 'month',
          },
        ]
      } else if (
        state?.value?.matches(`${prefix}.準備年訂閱`) ||
        state?.value?.matches(`${prefix}.準備將月訂閱升級年訂閱`)
      ) {
        return [
          {
            id: 1,
            detail: '鏡週刊Premium會員（年方案）',
            hint: '每月 $499 元，信用卡自動續扣',
            price: '原價 NT$1188',
            newPrice: 499,
            key: 'year',
          },
        ]
      } else {
        return [{}]
      }
    }
  },
  data() {
    return {
      isLoading: false,
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
    isMonthUpgradeToYear() {
      const currentMemberType = formatMemberType(
        this.$store.state['membership-subscribe']?.basicInfo?.type
      )
      const choosedPlanType = formatMemberType(this.perchasedPlan[0]?.key)

      if (currentMemberType === 'month' && choosedPlanType === 'year') {
        return true
      } else {
        return false
      }
    },
    frequency() {
      const planFrequency = this.perchasedPlan?.[0]?.key
      return formatMemberType(planFrequency)
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
      this.isLoading = true
      this.$refs.receiptDOM.check()
      this.$v.email.$touch()
      if (
        this.validateOn &&
        (this.$v.email.$error || this.formStatus.receipt !== 'OK')
      ) {
        this.isLoading = false
        return
      }

      // emit apiGateWay
      const result = await this.getPaymentDataFromApiGateWay()
      const tradeInfo = qs.parse(result)

      // encrypt tradeInfo
      const encryptPaymentPayload = this.encryptTradeInfo(tradeInfo)

      // carry encrypted paymentPayload to redirect page
      const queryString = qs.stringify(encryptPaymentPayload)
      this.$router.push(`/subscribe/redirect?${queryString}`)

      /*
       * if (this.orderStatus === 'success')
       *   return this.sendMembershipSubscribe('付款成功')
       * this.sendMembershipSubscribe('付款失敗')
       */
    },
    async updateHandler(e) {
      e.preventDefault()
      this.isLoading = true

      // get this member's current subscription id
      const currentSubscription = await this.$getPremiumMemberSubscriptionInfo()
      if (!currentSubscription) return

      // update subscription from month to year
      const result = await this.$updateSubscriptionFromMonthToYear(
        currentSubscription.id
      )
      this.isLoading = false
      if (result === 'success') {
        window.alert('方案已升級為年訂閱，下次扣款日立即生效。')
        window.location.assign('/section/member')
      } else {
        console.log('some error happended')
      }

      /*
       * if (this.orderStatus === 'success')
       *   return this.sendMembershipSubscribe('付款成功')
       * this.sendMembershipSubscribe('付款失敗')
       */
    },

    async getPaymentDataFromApiGateWay() {
      let gateWayPayload
      const isPremiumPurchase =
        this.frequency === 'year' || this.frequency === 'month'

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
      return await this.$getPaymentDataOfSubscription(gateWayPayload)
    },
    encryptTradeInfo(tradeInfo) {
      const newebpay = new NewebPay(NEWEBPAY_KEY, NEWEBPAY_IV)

      return newebpay.getEncryptedFormPostData(tradeInfo)
    },
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
