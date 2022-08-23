<template>
  <div class="cancel-ask">
    <template v-if="!canShowFeat && doesHaveIsPayByAppValue">
      <SubscribeWrapper v-if="isPayByApp">
        <h6 class="cancel-ask__title">取消訂閱提示</h6>
        <p class="cancel-ask__description">
          由於您先前於 APP 購買，如要取消訂閱，請至 App Store (iOS 系統) 或
          Google Play (Android 系統) 操作
        </p>
        <UiMembershipButtonPrimary
          class="subscribe-cancel__back"
          @click.native="handleGoToProfilePurchase"
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
            >返回
          </UiMembershipButtonSecondary>
          <UiMembershipButtonPrimary @click.native="handleSubmit"
            >確認取消訂閱</UiMembershipButtonPrimary
          >
        </div>
      </SubscribeWrapper>
    </template>

    <template v-if="canShowFeat && doesHaveIsPayByAppValue">
      <SubscribeWrapper v-if="isPayByApp">
        <h6 class="cancel-ask__title">取消訂閱提示</h6>
        <p class="cancel-ask__description">
          由於您先前於 APP 購買，如要取消訂閱，請至 App Store (iOS 系統) 或
          Google Play (Android 系統) 操作
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
    </template>

    <UiLoadingCover v-if="!canShowFeat && isLoading" />

    <!-- if fetch is not complete, or form is not submitted, show loading-->
    <UiLoadingCover v-if="canShowFeat && ($fetchState.pending || isLoading)" />
  </div>
</template>

<script>
import SubscribeWrapper from '~/components/SubscribeWrapper.vue'
import UiMembershipButtonPrimary from '~/components/UiMembershipButtonPrimary.vue'
import UiMembershipButtonSecondary from '~/components/UiMembershipButtonSecondary.vue'
import UiMembershipCheckoutLabel from '~/components/UiMembershipCheckoutLabel.vue'
import UiLoadingCover from '~/components/UiLoadingCover.vue'

export default {
  middleware: ['handle-go-to-marketing'],
  components: {
    SubscribeWrapper,
    UiMembershipButtonPrimary,
    UiMembershipButtonSecondary,
    UiMembershipCheckoutLabel,
    UiLoadingCover,
  },
  async fetch() {
    // check if user's subscription is paid by mobile
    const isMemberPaidWithMobile =
      await this.$isMemberPaidSubscriptionWithMobile()
    this.isPayByApp = isMemberPaidWithMobile
  },
  data() {
    return {
      isLoading: false,
      isPayByApp: undefined,
      reason: [],
      cancelStatus: 'success',
      otherDetail: '',
    }
  },
  computed: {
    shouldShowTextarea() {
      return this.reason.includes('其他')
    },
    reasonString() {
      return this.reason.length
        ? `取消原因：${this.reason.join('、')}。`
        : '取消原因：未填寫。'
    },
    doesHaveIsPayByAppValue() {
      return this.isPayByApp !== undefined
    },
    canShowFeat() {
      return this.$route.query?.toggle === 'show-toggle-feature'
    },
  },
  methods: {
    handleBack() {
      window.location.assign('/subscribe/set')
    },
    handleGoToProfilePurchase() {
      window.location.assign('/profile/purchase')
    },
    async handleSubmit() {
      /*
       * ======To Kevin Start=======
       * ======To Kevin End=======
       */
      try {
        this.isLoading = true
        await this.$cancelMemberSubscription(this.reasonString)

        this.isLoading = false
        this.cancelStatus = 'success'
        this.$customRouter.push('/subscribe/cancel-success')
      } catch (error) {
        console.error(error)
        this.isLoading = false
        this.$customRouter.push('/subscribe/cancel-fail')
      }
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
  min-height: calc(100vh - 150px);
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
