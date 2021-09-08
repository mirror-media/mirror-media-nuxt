<template>
  <div class="cancel-ask">
    <SubscribeWrapper v-if="isPayByApp">
      <h6 class="cancel-ask__title">取消訂閱提示</h6>
      <p class="cancel-ask__description">
        由於您先前於 APP 購買，如要取消訂閱，請至 App Store (iOS 系統) 或 Google
        Play (Android 系統) 操作
      </p>
      <UiMembershipButtonPrimary
        class="subscribe-cancel__back"
        @click.native="handleBack"
        >回訂閱紀錄</UiMembershipButtonPrimary
      >
    </SubscribeWrapper>
    <SubscribeWrapper v-else @back="handleBack" @submit="handleSubmit">
      <h6 class="cancel-ask__title">取消訂閱</h6>
      <p class="cancel-ask__description">
        請問您為何想取消訂閱鏡週刊 Premium 服務？
      </p>
      <UiMembershipCheckoutLabel
        content="文章無法滿足需求"
        @change="handleChange"
      />
      <UiMembershipCheckoutLabel
        content="已訂閱其他媒體"
        @change="handleChange"
      />
      <UiMembershipCheckoutLabel
        content="使用體驗不佳"
        @change="handleChange"
      />
      <UiMembershipCheckoutLabel
        content="想改用單篇付費方式繼續閱讀"
        @change="handleChange"
      />
      <UiMembershipCheckoutLabel content="其他" @change="handleChange" />
      <textarea
        v-if="shouldShowTextarea"
        v-model="otherDetail"
        placeholder="請輸入您的回饋..."
        rows="3"
      />
      <div class="cancel-ask__button_group">
        <UiMembershipButtonSecondary @click.native="handleBack"
          >返回</UiMembershipButtonSecondary
        >
        <UiMembershipButtonPrimary @click.native="handleSubmit"
          >確認取消訂閱</UiMembershipButtonPrimary
        >
      </div>
    </SubscribeWrapper>
    <SubscribeCancelSimForm
      v-if="shouldShowSim"
      :isPayByApp="isPayByApp"
      :cancelStatus="cancelStatus"
      :setIsPayByApp="setIsPayByApp"
      :setCancelStatus="setCancelStatus"
    />
  </div>
</template>

<script>
import { ENV } from '~/configs/config'
import SubscribeWrapper from '~/components/SubscribeWrapper.vue'
import SubscribeCancelSimForm from '~/components/SubscribeCancelSimForm.vue'
import UiMembershipButtonPrimary from '~/components/UiMembershipButtonPrimary.vue'
import UiMembershipButtonSecondary from '~/components/UiMembershipButtonSecondary.vue'
import UiMembershipCheckoutLabel from '~/components/UiMembershipCheckoutLabel.vue'
import { useMemberSubscribeMachine } from '~/xstate/member-subscribe/compositions'

export default {
  components: {
    SubscribeWrapper,
    SubscribeCancelSimForm,
    UiMembershipButtonPrimary,
    UiMembershipButtonSecondary,
    UiMembershipCheckoutLabel,
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
      isPayByApp: false,
      reason: [],
      cancelStatus: 'success',
      otherDetail: '',
    }
  },
  computed: {
    shouldShowSim() {
      return ENV !== 'prod' && ENV !== 'staging'
    },
    shouldShowTextarea() {
      return this.reason.includes('其他')
    },
    reasonString() {
      return this.reason.length
        ? `取消原因：${this.reason.join('、')}。`
        : '取消原因：未填寫。'
    },
  },
  methods: {
    handleBack() {
      window.location.assign('/subscribe/set')
    },
    async handleSubmit() {
      // ======To Kevin Start=======
      const updatedCancelStatus = await this.$cancelMemberSubscription(
        this.reasonString
      )
      console.log(updatedCancelStatus)
      this.cancelStatus = updatedCancelStatus
      // ======To Kevin End=======

      if (this.cancelStatus === 'success') {
        // return window.location.assign('/subscribe/cancel-success')
        this.sendMembershipSubscribe('確認取消訂閱成功')
      }
      this.sendMembershipSubscribe('確認取消訂閱失敗')
    },
    setIsPayByApp(val) {
      this.isPayByApp = val
    },
    setCancelStatus(val) {
      this.cancelStatus = val
    },
    handleChange(value) {
      if (value.type === 'add') {
        return this.reason.push(value.value)
      }
      this.reason = this.reason.filter((item) => item !== value.value)
    },
  },
}
</script>

<style lang="scss" scoped>
.cancel-ask {
  min-height: calc(100vw - 150px);
  padding: 40px 20px 0 20px;
  @include media-breakpoint-up(sm) {
    min-height: calc(100vw - 850px);
    padding: 80px;
  }

  &__title {
    font-size: 20px;
    line-height: 32px;
    color: rgba(0, 0, 0, 0.87);
  }

  &__description {
    margin: 4px 0 24px 0;
    color: rgba(0, 0, 0, 0.66);
  }

  label {
    display: block;
    color: rgba(0, 0, 0, 0.87);

    input {
      height: 16px;
      width: 16px;
      margin-right: 8px;
    }

    &:not(:first-child) {
      margin-top: 8px;
    }
  }

  textarea {
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 2px;
    width: 100%;
    height: 99px;
    padding: 12px;
    margin-top: 8px;
    resize: none;

    &::placeholder {
      color: rgba(0, 0, 0, 0.3);
    }

    &:focus {
      border: 1px solid rgba(0, 0, 0, 0.87);
      outline: none;
    }
  }

  &__button_group {
    display: flex;
    justify-content: space-between;
    margin-top: 32px;
    .button {
      width: 64px;
      height: 38px;
      padding: 8px 12px;
      font-size: 16px;
      line-height: 22px;
      &:nth-child(2) {
        width: 128px;
      }
    }
  }

  &__back {
    margin: 0 auto;
    width: 240px;
    height: 48px;
  }
}
</style>
