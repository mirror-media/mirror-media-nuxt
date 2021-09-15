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
import qs from 'qs'
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
          price: '原價 NT$99',
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
      const paymentPayload = {
        MerchantID: 'MS315799494',
        TradeInfo:
          '2d33a862e529fbf07b264c6abfc079ab5aad16897d81a77202029432eb21c3b750491bcdfea54d0609db24b6553a640c6734567fb8d3171f57b928b4dc83d3f6177683a8d25c2058097133d8daa5ff93c9a1a0d432b61ad1628f297d82d300e57296c9ed8286c8409fac8f1fbac7881e1c317776c4549de1d62ae1549c34b2e6c4aeaac031a2d866a20a34c091e726ab78375b4f0d91158d283efd79b5d7a7561c4005dcda53609abbcaeabbd82beede45dfddcdf1b4b34b7e27d6d1b702409d97c2bb21bd3a342e3cc5d7efb42d1a85145f409c08d18f6290f89aee99896d13319231721b6ce70d5747506ee2195f492d60c4adb83cd6bab3aa30a97613cef3aa86b51e5ffe54f487c31f0bbf99ea1678472b70ac902e6b21b74685c429b88ade11b94196c4496862278227129390abcdff7225389eaf0a2a8ad6b982090dab2a783c69aa9dfb546fac7563e6dd2df3899427c43ae1d1961f101699b46f2861a14042c93b3ac363cce47dd7a07bd157ddbddcd369bd080d78436bdb3f0bfdfdf2a67b2d1e9cf8337d0d0813437b9bf6f6611aba7571dd7520c5c9d2706729c6a665a3deae9464293c7d2301e8acb642f2c6e3ed0abe8496e66b2604dd3d1cc78b7b4a0c78297d8d91b02836b5f98b7abe44c7b01d108b4290c4b285b46819b985ef9d4845b087b326aa2e3fed9524e351cb5fc3aac6ef74e4785f05e0dc7541b80ff23d3801929100bd03d8107b910a053e67c48d4e3cf01ed0fc5d5a4ecf46a19a58a1b4c4cfc59fa3349ff9cd127856825e633c49093cb1b286d9e9b70532c8119b6357ac8abb06fc8ecd8bb2dd9b4de216dea02ba1da6b49521f37d0e4502140795985c69ef1e99a2db13aa1c50803aaa686b1af1ebb1206068cb7caef02bc7cad0ac050a51a9e4edb7ad8299486e144d4615fa8f1d5dc33f88256fa475feea4e180a433d48f2f95ed07c1658c3155c427ad30ba773c746900242320091c',
        TradeSha:
          'E202663F3A136E01C2B640BC117DC8C91450A47E475998CB65BA54729A36A353',
        Version: 1.6,
      }
      const queryString = qs.stringify(paymentPayload)

      this.$router.push(`/subscribe/redirect?${queryString}`)

      // if (this.orderStatus === 'success')
      //   return this.sendMembershipSubscribe('付款成功')
      // this.sendMembershipSubscribe('付款失敗')
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
      return await this.$getPaymentDataOfSubscription(gateWayPayload)
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
