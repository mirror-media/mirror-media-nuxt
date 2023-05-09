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
          <SubscribeFormPayment
            v-if="showLINEPayUI && !isUpgradeFromMonthToYear"
            ref="paymentDOM"
            :setPaymentMethod="setPaymentMethod"
            :validateOn="validateOn"
            :setFormStatus="setFormStatus"
            :frequency="frequency"
          />
          <SubscribeFormReceipt
            v-if="!isUpgradeFromMonthToYear"
            ref="receiptDOM"
            :setReceiptData="setReceiptData"
            :validateOn="validateOn"
            :setFormStatus="setFormStatus"
            :email="email"
          />
          <div v-if="!isServicesRuleAgree" class="service-rule">
            <span
              v-if="isNeedToCheck && !isCheckingServiceRule"
              class="service-rule__error"
              >以下尚未勾選
            </span>
            <label>
              <input
                v-model="isCheckingServiceRule"
                type="checkbox"
                :checked="isCheckingServiceRule"
              />
              <span
                >我同意與接受鏡傳媒的<a
                  href="https://www.mirrormedia.mg/story/service-rule/"
                  target="_blank"
                  rel="noreferrer noopener"
                  class="service-rule__link"
                  >《服務條款》</a
                ></span
              >
            </label>
          </div>
          <p
            v-if="!isUpgradeFromMonthToYear"
            class="subscribe-info__form_left_hint"
          >
            <template v-if="showLINEPayUI">
              按下開始結帳後，頁面將會跳離，抵達由藍新金流 NewebPay&#xff0f;LINE
              Pay 所提供的線上結帳頁面，完成後將會再跳回到鏡週刊
            </template>
            <template v-else>
              按下開始結帳後，頁面將會跳離，抵達由藍新金流 NewebPay
              所提供的線上結帳頁面，完成後將會再跳回到鏡週刊
            </template>
          </p>
          <template v-if="showLINEPayUI">
            <UiSubscribeButton
              v-if="isUpgradeFromMonthToYear"
              class="change-plan-btn"
              title="確認變更方案"
              :isLoading="isLoading"
              @click.native="updateHandler"
            />
            <template v-else>
              <UiSubscribeButton
                title="開始結帳"
                :isLoading="isLoading"
                :class="{ disabled: disallowToSubmit }"
                @click.native="submitHandler"
              />
            </template>
          </template>
          <template v-else>
            <UiSubscribeButton
              v-if="isUpgradeFromMonthToYear"
              class="change-plan-btn"
              title="確認變更方案"
              :isLoading="isLoading"
              @click.native="updateHandler"
            />
            <template v-else>
              <UiSubscribeButton
                title="使用信用卡結帳"
                :isLoading="isLoading"
                @click.native="submitHandler"
              />
            </template>
          </template>
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
      :newebpayApiUrl="newebpayApiUrl"
    />
  </div>
</template>

<script>
import qs from 'qs'
import { required, email, sameAs } from 'vuelidate/lib/validators'
import { useRoute, useStore } from '@nuxtjs/composition-api'
import {
  ENV,
  DOMAIN_NAME,
  NEWEBPAY_MEMBERSHIP_API_URL,
} from '~/configs/config.js'
import SubscribeStepProgress from '~/components/SubscribeStepProgress.vue'
import MembershipFormPlanList from '~/components/MembershipFormPlanList.vue'
import MembershipFormPerchaseInfo from '~/components/MembershipFormPerchaseInfo.vue'
import SubscribeFormPayment from '~/components/SubscribeFormPayment.vue'
import SubscribeFormReceipt from '~/components/SubscribeFormReceipt.vue'
import UiSubscribeButton from '~/components/UiSubscribeButton.vue'
import NewebpayForm from '~/components/NewebpayForm.vue'
import { STATUS as REQUEST_STATUS } from '~/constants/request.js'
import { Frequency, MemberType, PaymentMethod } from '~/constants/common'

// import redirectDestination from '~/utils/redirect-destination'

export default {
  middleware: [
    'authenticate',
    'handle-go-to-marketing',
    'handle-go-to-email-verify',
  ],
  components: {
    SubscribeStepProgress,
    MembershipFormPlanList,
    MembershipFormPerchaseInfo,
    SubscribeFormPayment,
    SubscribeFormReceipt,
    UiSubscribeButton,
    NewebpayForm,
  },
  setup() {
    const route = useRoute()
    const { state } = useStore()
    const perchasedPlan = usePerchasedPlan()
    const isServicesRuleAgree = state['membership-subscribe'].basicInfo.tos
    const isCheckingServiceRule = false
    const isNeedToCheck = false
    return {
      perchasedPlan,
      isUpgradeFromMonthToYear:
        route.value.query.plan === Frequency.Yearly &&
        state['membership-subscribe'].basicInfo.type === MemberType.Monthly,
      isServicesRuleAgree,
      isCheckingServiceRule,
      isNeedToCheck,
    }

    function usePerchasedPlan() {
      const route = useRoute()

      switch (route.value.query.plan) {
        case Frequency.OneTimeHyphen:
          return [
            {
              id: route.value.query['one-time-post-id'],
              detail: '鏡週刊Basic會員（單篇）',
              hint: '$5 元可享單篇好文 14 天無限瀏覽',
              price: '原價 NT$5',
              newPrice: 5,
              key: 'basic',
            },
          ]
        case Frequency.Monthly:
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
        case Frequency.Yearly:
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
        default:
          return [{}]
      }
    }
  },
  data() {
    return {
      isLoading: false,
      promoteId: 0, // NOTE： 折扣碼必須有值，如果undefined（發query的時候沒有附帶在variables中）會報錯
      email: '',
      paymentMethod: '',
      receiptData: {
        receiptPlan: '',
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
        payment: 'OK',
        receipt: 'ERROR',
      },
      paymentPayload: {},
      newebpayApiUrl: NEWEBPAY_MEMBERSHIP_API_URL,
      linepayUiToggle: this.$config.linepayUiToggle,
    }
  },
  computed: {
    frequency() {
      const planFrequency = this.perchasedPlan?.[0]?.key
      const map = {
        basic: Frequency.OneTime,
        monthly: Frequency.Monthly,
        yearly: Frequency.Yearly,
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
    showLINEPayUI() {
      return this.linepayUiToggle
    },
    isPremiumPurchase() {
      return [Frequency.Monthly, Frequency.Yearly].includes(this.frequency)
    },
    disallowToSubmit() {
      if (this.isServicesRuleAgree || this.isCheckingServiceRule) {
        return (
          this.paymentMethod === '' ||
          !this.frequency ||
          this.formStatus.receipt !== 'OK' ||
          !this.email ||
          (!this.$v.email.email && this.$v.email.$error)
        )
      }
      return true
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
    isCheckingServiceRule: { required, sameAs: sameAs(() => true) },
  },
  async created() {
    /*
     * ======To Kevin Start=======
     * const isMemberCheckedServiceRule = await this.$getMemberServiceRuleStatus(
     *   this
     * )
     * console.log(this)
     * console.log(isMemberCheckedServiceRule)
     */
    // ======To Kevin End=======
  },

  methods: {
    handleBack() {
      window.location.assign('/subscribe')
    },
    setValidateOn() {
      this.validateOn = !this.validateOn
    },
    setPaymentMethod(paymentMethod) {
      this.paymentMethod = paymentMethod
    },
    setReceiptData(editedReceiptData) {
      this.receiptData = editedReceiptData
      this.$nextTick(function () {
        this.$refs.receiptDOM.check()
      })
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

      // invalid plan
      if (!this.frequency) return

      try {
        // input validation section
        this.isLoading = true
        this.$refs.receiptDOM.check()
        if (this.showLINEPayUI) {
          this.$refs.paymentDOM.check()
        }
        this.$v.email.$touch()
        if (
          this.$store.state.membership.emailVerifyFeatureToggle === 'on' &&
          !this.isServicesRuleAgree
        ) {
          if (this.$v.isCheckingServiceRule.sameAs) {
            this.$setMemberServiceRuleStatusToTrue()
          } else {
            this.isLoading = false
            this.isNeedToCheck = true
            return
          }
        }

        if (
          this.validateOn &&
          (this.$v.email.$error || this.formStatus.receipt !== 'OK')
        ) {
          this.isLoading = false
          return
        }

        if (this.showLINEPayUI && this.formStatus.payment !== 'OK') {
          this.isLoading = false
          return
        }

        if (this.showLINEPayUI && this.paymentMethod === 'linepay') {
          const {
            data: { status, data, message },
          } = await this.getPaymentInfoFromBackend()

          if (status === REQUEST_STATUS.SUCCESS) {
            window.location.href = data.paymentInfo?.paymentUrl?.web
          } else if (status === REQUEST_STATUS.FAIL) {
            window.alert('您的訂閱資料有誤，請修正後再嘗試')
            this.isLoading = false
          } else {
            throw new Error(message)
          }

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
        const currentSubscription =
          await this.$getPremiumMemberSubscriptionInfo()
        if (!currentSubscription) return

        // update subscription from month to year
        const updatedSubscription =
          await this.$updateSubscriptionFromMonthToYear(currentSubscription.id)
        this.isLoading = false

        window.alert('方案已升級為年訂閱，下次扣款日立即生效。')

        const orderNumber =
          updatedSubscription?.data?.updatesubscription?.orderNumber
        this.$router.push(
          `/subscribe/success?orderNumber=${orderNumber}&code=${Frequency.Yearly}`
        )
      } catch (error) {
        console.error(error)
        this.isLoading = false
      }
    },

    // for LINE Pay payment
    async getPaymentInfoFromBackend() {
      let payload
      if (this.isPremiumPurchase) {
        payload = {
          member: {
            connect: {
              firebaseId: this.$getUserFirebaseId(),
            },
          },
          email: this.email,
          frequency: this.frequency,
          paymentMethod: PaymentMethod.LINEPay,
          status: null, // write null to left field empty
          linePayStatus: 'paying',
          promoteId: this.promoteId, // 折扣碼 (TODO)
          loveCode: parseInt(this.validReceiptData.donateOrganization),
          carrierType: this.validReceiptData.carrierType,
          carrierNum: this.validReceiptData.carrierNumber,
          buyerName: this.validReceiptData.carrierTitle,
          buyerUBN: this.validReceiptData.carrierUbn,
          category: this.getCategory(),
        }
      } else {
        // one_time
        const subscribePostId = this.perchasedPlan?.[0]?.id
        payload = {
          member: {
            connect: {
              firebaseId: this.$getUserFirebaseId(),
            },
          },
          email: this.email,
          paymentMethod: PaymentMethod.LINEPay,
          status: null, // write null to left field empty
          linePayStatus: 'paying',
          promoteId: this.promoteId, // 折扣碼 (TODO)
          postId: subscribePostId,
          loveCode: parseInt(this.validReceiptData.donateOrganization),
          carrierType: this.validReceiptData.carrierType,
          carrierNum: this.validReceiptData.carrierNumber,
          buyerName: this.validReceiptData.carrierTitle,
          buyerUBN: this.validReceiptData.carrierUbn,
          category: this.getCategory(),
        }
      }

      return await this.$axios.post(
        `${window.location.origin}/api/v2/linepay/v1?frequency=${this.frequency}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${this.$store.state.membership.userToken}`,
          },
        }
      )
    },

    // for Newebpay Payment
    async getPaymentDataFromApiGateWay() {
      let gateWayPayload

      if (this.isPremiumPurchase) {
        gateWayPayload = {
          email: this.email,
          frequency: this.frequency,
          paymentMethod: PaymentMethod.NewebPay,
          status: 'paying',
          promoteId: this.promoteId, // 折扣碼 (TODO)
          loveCode: parseInt(this.validReceiptData.donateOrganization),
          carrierType: this.validReceiptData.carrierType,
          carrierNum: this.validReceiptData.carrierNumber,
          buyerName: this.validReceiptData.carrierTitle,
          buyerUBN: this.validReceiptData.carrierUbn,
          category: this.getCategory(),
        }
      } else {
        // one_time
        const subscribePostId = this.perchasedPlan?.[0]?.id
        gateWayPayload = {
          email: this.email,
          paymentMethod: PaymentMethod.NewebPay,
          status: 'paying',
          promoteId: this.promoteId, // 折扣碼 (TODO)
          postId: subscribePostId,
          loveCode: parseInt(this.validReceiptData.donateOrganization),
          carrierType: this.validReceiptData.carrierType,
          carrierNum: this.validReceiptData.carrierNumber,
          buyerName: this.validReceiptData.carrierTitle,
          buyerUBN: this.validReceiptData.carrierUbn,
          category: this.getCategory(),
        }
      }

      return await this.$getPaymentDataOfSubscription(gateWayPayload)
    },
    getCategory() {
      switch (this.receiptData.receiptPlan) {
        case '三聯式發票':
          return 'B2B'

        case '捐贈':
        default:
        case '二聯式發票（含載具）':
          return 'B2C'
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
      & > .service-rule {
        margin-top: 32px;
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

::v-deep {
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
      color: #e51731;
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
.service-rule {
  font-size: 18px;
  line-height: 25px;
  color: rgba(0, 0, 0, 0.87);
  display: flex;
  align-items: flex-start;
  flex-direction: column;

  label {
    display: flex;
    align-items: center;

    input[type='checkbox'] {
      width: 16px;
      height: 16px;
      margin-right: 8px;
    }
  }

  &__link {
    color: #1d9fb8;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
  &__error {
    font-size: 16px;
    line-height: 150%;
    color: #e51731;
    margin-bottom: 8px;
  }
}
</style>
