<template>
  <div class="subscribe-info">
    <SubscribeStepProgress
      :currentStep="2"
      :isUpgradeFromMonthToYear="isUpgradeFromMonthToYear"
    />

    <div class="subscribe-info__form">
      <div class="subscribe-info__form_wrapper">
        <div class="subscribe-info__form_left">
          <MembershipFormPlanList
            :perchasedPlan="perchasedPlan"
            :isUpgradeFromMonthToYear="isUpgradeFromMonthToYear"
            @back="handleBack"
          />
          <div
            v-if="!isUpgradeFromMonthToYear"
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
            v-if="!isUpgradeFromMonthToYear"
            ref="receiptDOM"
            :setReceiptData="setReceiptData"
            :validateOn="validateOn"
            :setFormStatus="setFormStatus"
            :email="email"
          />
          <p
            v-if="!isUpgradeFromMonthToYear"
            class="subscribe-info__form_left_hint"
          >
            按下開始結帳後，頁面將會跳離，抵達由藍新金流 NewebPay
            所提供的線上結帳頁面，完成後將會再跳回到鏡週刊
          </p>
          <UiSubscribeButton
            v-if="isUpgradeFromMonthToYear"
            class="change-plan-btn"
            title="確認變更方案"
            :isLoading="isLoading"
            @click.native="updateHandler"
          />
          <UiSubscribeButton
            v-else
            title="開始結帳"
            :isLoading="isLoading"
            @click.native="submitHandler"
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
    <NewebpayForm
      :merchantId="paymentPayload.MerchantID"
      :tradeInfo="paymentPayload.TradeInfo"
      :tradeSha="paymentPayload.TradeSha"
      :version="paymentPayload.Version"
    />
  </div>
</template>

<script>
import qs from 'qs'
import { required, email } from 'vuelidate/lib/validators'
import { ENV, DOMAIN_NAME } from '~/configs/config.js'
import SubscribeStepProgress from '~/components/SubscribeStepProgress.vue'
import MembershipFormPlanList from '~/components/MembershipFormPlanList.vue'
import MembershipFormPerchaseInfo from '~/components/MembershipFormPerchaseInfo.vue'
import SubscribeFormReceipt from '~/components/SubscribeFormReceipt.vue'
import UiSubscribeButton from '~/components/UiSubscribeButton.vue'
import NewebpayForm from '~/components/NewebpayForm.vue'
import { useMemberSubscribeMachine } from '~/xstate/member-subscribe/compositions'
export default {
  // middleware: ['handle-go-to-marketing', 'handle-forbid-direct-navigate'],
  components: {
    SubscribeStepProgress,
    MembershipFormPlanList,
    MembershipFormPerchaseInfo,
    SubscribeFormReceipt,
    UiSubscribeButton,
    NewebpayForm,
  },
  setup() {
    const { state, send } = useMemberSubscribeMachine()
    const perchasedPlan = usePerchasedPlan()
    return {
      stateMembershipSubscribe: state,
      sendMembershipSubscribe: send,
      perchasedPlan,
      isUpgradeFromMonthToYear: !!state?.value?.matches(
        '會員訂閱功能.方案購買流程.確認訂購頁.確認訂購表單頁.準備將月訂閱升級年訂閱'
      ),
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
            key: 'monthly',
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
            hint: '每年 $499 元，信用卡自動續扣',
            price: '原價 NT$1188',
            newPrice: 499,
            key: 'yearly',
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
      promoteId: 0, // NOTE： 折扣碼必須有值，如果undefined（發query的時候沒有附帶在variables中）會報錯
      email: '',
      receiptData: {
        receiptPlan: '捐贈',
        donateOrganization: '',
        carrierType: '',
        carrierNumber: '',
        carrierTitle: '',
        carrierUbn: '',
        category: '',
      },
      orderStatus: 'success', //  fail, success
      validateOn: true,
      formStatus: {
        receipt: 'OK',
      },
      paymentPayload: {},
    }
  },
  computed: {
    frequency() {
      const planFrequency = this.perchasedPlan?.[0]?.key
      const map = {
        basic: 'one_time',
        monthly: 'monthly',
        yearly: 'yearly',
      }
      return map[planFrequency]
    },
    validReceiptData() {
      let validReceiptData
      switch (this.receiptData.receiptPlan) {
        case '捐贈':
          validReceiptData = {
            donateOrganization: this.receiptData.donateOrganization,
            carrierType: '',
            carrierNumber: '',
            carrierTitle: '',
            carrierUbn: '',
          }
          break

        case '二聯式發票（含載具）':
          validReceiptData = {
            donateOrganization: '',
            carrierType: this.receiptData.carrierType,
            carrierNumber: this.receiptData.carrierNumber,
            carrierTitle: '',
            carrierUbn: '',
          }
          break

        case '三聯式發票':
          validReceiptData = {
            donateOrganization: '',
            carrierType: '',
            carrierNumber: '',
            carrierTitle: this.receiptData.carrierTitle,
            carrierUbn: this.receiptData.carrierUbn,
          }
          break
      }

      return validReceiptData
    },
  },
  watch: {
    'receiptData.carrierType'() {
      if (this.receiptData.carrierType === '2')
        this.receiptData.carrierNumber = this.$store.state.membership.userEmail
    },
  },
  mounted() {
    this.email = this.$store.state.membership.userEmail
  },
  validations: {
    email: {
      email,
      required,
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
      window.location.assign('/subscribe')
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
      if (this.isLoading) return

      try {
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

        tradeInfo.ReturnURL =
          ENV === 'local'
            ? `http://localhost:3000/subscribe/return`
            : `https://${DOMAIN_NAME}/subscribe/return`

        // // encrypt tradeInfo
        this.paymentPayload = await this.$axios.$post(
          `${window.location.origin}/api/v2/newebpay/v1`,
          tradeInfo
        )
        this.$nextTick(() => {
          const formDOM = document.forms.newebpay
          formDOM.submit()
        })
      } catch (error) {
        console.error(error.message)
        window.alert('您的訂閱流程發生了錯誤，請稍後再試')
        const e = new Error()
        e.massage = 'not found'
        e.code = '404'
        throw e
      }
    },
    async updateHandler(e) {
      e.preventDefault()
      if (this.isLoading) return

      try {
        this.isLoading = true

        // get this member's current subscription id
        const currentSubscription = await this.$getPremiumMemberSubscriptionInfo()
        if (!currentSubscription) return

        // update subscription from month to year
        const updatedSubscription = await this.$updateSubscriptionFromMonthToYear(
          currentSubscription.id
        )
        this.isLoading = false

        window.alert('方案已升級為年訂閱，下次扣款日立即生效。')

        const orderNumber =
          updatedSubscription?.data?.updatesubscription?.orderNumber
        this.$router.push(
          `/subscribe/success?orderNumber=${orderNumber}&code=yearly`
        )
      } catch (error) {
        console.error(error)
        this.isLoading = false
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
        this.frequency === 'yearly' || this.frequency === 'monthly'

      if (isPremiumPurchase) {
        gateWayPayload = {
          email: this.email,
          frequency: this.frequency,
          paymentMethod: 'newebpay',
          status: 'paying',
          promoteId: this.promoteId, // 折扣碼 (TODO)
          loveCode: parseInt(this.validReceiptData.donateOrganization),
          carrierType: this.validReceiptData.carrierType,
          carrierNum: this.validReceiptData.carrierNumber,
          buyerName: this.validReceiptData.carrierTitle,
          buyerUBN: this.validReceiptData.carrierUbn,
          category: getCategory.bind(this)(),
        }
      } else {
        // one_time
        const subscribePostId = this.perchasedPlan?.[0]?.id
        gateWayPayload = {
          email: this.email,
          paymentMethod: 'newebpay',
          status: 'paying',
          promoteId: this.promoteId, // 折扣碼 (TODO)
          postId: subscribePostId,
          loveCode: parseInt(this.validReceiptData.donateOrganization),
          carrierType: this.validReceiptData.carrierType,
          carrierNum: this.validReceiptData.carrierNumber,
          buyerName: this.validReceiptData.carrierTitle,
          buyerUBN: this.validReceiptData.carrierUbn,
          category: getCategory.bind(this)(),
        }
      }

      return await this.$getPaymentDataOfSubscription(gateWayPayload)

      function getCategory() {
        switch (this.receiptData.receiptPlan) {
          case '三聯式發票':
            return 'B2B'

          case '捐贈':
          default:
          case '二聯式發票（含載具）':
            return 'B2C'
        }
      }
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

      .change-plan-btn {
        width: 380px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0%;
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
