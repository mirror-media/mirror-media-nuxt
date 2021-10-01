<template>
  <section>
    <SubscribeStepProgress :currentStep="3" />
    <div class="subscribe-success">
      <div class="subscribe-success__message">
        {{ successMessage }}
      </div>
      <div class="subscribe-success__info">
        <h1 class="subscribe-success__info_title">訂單資訊</h1>
        <SubscribeSuccessOrderInfoContentRow
          title="訂單編號"
          :data="orderInfo.orderId"
        />
        <SubscribeSuccessOrderInfoContentRow
          title="訂單日期"
          :data="orderDate"
        />
        <SubscribeSuccessOrderInfoContentRow
          v-if="orderInfo.discountPrice"
          title="優惠折扣碼"
          :data="orderInfo.discountPrice"
        />
        <!--        <SubscribeSuccessOrderInfoContentRow-->
        <!--          title="訂閱起訖"-->
        <!--          :data="orderInfo.during"-->
        <!--          class="during"-->
        <!--        />-->
        <div class="subscribe-success__info_row">
          <div class="subscribe-success__info_row_title">訂閱方案</div>
          <div class="subscribe-success__info_row_data">
            <MembershipFormPerchaseInfo
              :perchasedPlan="perchasedList"
              :showTitle="false"
            />
          </div>
        </div>
        <div class="subscribe-success__info_button">
          <UiSubscribeButton
            v-if="isNavigateFromPremiumPage"
            title="回購買文章頁"
            @click.native="sendMembershipSubscribe('回購買文章頁')"
          />
          <a v-else href="/section/member">
            <UiSubscribeButton title="瀏覽 Premium 會員文章" />
          </a>
          <a href="/profile/purchase">
            <UiMembershipButtonSecondary>
              回訂閱紀錄
            </UiMembershipButtonSecondary>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import dayjs from 'dayjs'
import { useMemberSubscribeMachine } from '~/xstate/member-subscribe/compositions'
import SubscribeStepProgress from '~/components/SubscribeStepProgress.vue'
import SubscribeSuccessOrderInfoContentRow from '~/components/SubscribeSuccessOrderInfoContentRow.vue'
import MembershipFormPerchaseInfo from '~/components/MembershipFormPerchaseInfo.vue'
import UiSubscribeButton from '~/components/UiSubscribeButton.vue'
import UiMembershipButtonSecondary from '~/components/UiMembershipButtonSecondary.vue'

export default {
  middleware: ['handle-go-to-marketing'],
  setup() {
    const { state, send } = useMemberSubscribeMachine()
    send('付款成功')
    return {
      stateMembershipSubscribe: state,
      sendMembershipSubscribe: send,
      isNavigateFromPremiumPage: !!state?.value?.matches(
        '會員訂閱功能.方案購買流程.付款成功頁.是從會員文章頁來的'
      ),
    }
  },
  components: {
    SubscribeStepProgress,
    SubscribeSuccessOrderInfoContentRow,
    MembershipFormPerchaseInfo,
    UiSubscribeButton,
    UiMembershipButtonSecondary,
  },
  data() {
    return {
      orderInfo: {
        orderId: this.$route.query.orderNumber ?? '',
      },
      orderDate: dayjs(new Date()).format('YYYY-MM-DD'),

      // TODO: remove due to not use anymore
      hasLink: false,
      isUpgradeFromMonthToYear: true,
    }
  },
  computed: {
    perchasedList() {
      switch (this.$route.query.code) {
        case 'one_time': {
          return [
            {
              detail: '鏡週刊Basic會員（單篇）',
              hint: '單篇 $1 元，享 14 天內無限次觀看',
              price: '原價 NT$1',
              newPrice: 1,
              key: 'basic',
            },
          ]
        }
        case 'monthly': {
          return [
            {
              detail: '鏡週刊Premium會員（月方案）',
              hint: '每月 $49 元，信用卡自動續扣',
              price: '原價 NT$99',
              newPrice: 49,
              key: 'month',
            },
          ]
        }
        case 'yearly': {
          return [
            {
              detail: '鏡週刊Premium會員（年方案）',
              hint: '每年 $499 元，信用卡自動續扣',
              price: '原價 NT$1188',
              newPrice: 499,
              key: 'year',
            },
          ]
        }
        default: {
          return [{}]
        }
      }
    },
    successMessage() {
      if (this.isUpgradeFromMonthToYear) {
        return '您已完成變更方案，以下為本次變更資訊，您的新方案將於下期開始進行。'
      } else {
        return '您已完成付款，以下為本次訂購資訊，已同步寄送至您的信箱。'
      }
    },
  },
  methods: {
    // TODO: remove due to not use anymore
    toggleHasLink() {
      this.hasLink = !this.hasLink
    },
  },
}
</script>

<style lang="scss" scoped>
.subscribe-success {
  max-width: 960px;
  margin: 0 auto;
  padding: 20px 8px;
  color: rgba(0, 0, 0, 0.87);
  @include media-breakpoint-up(sm) {
    padding: 48px 5px;
    font-size: 18px;
    line-heipht: 27px;
  }

  &__message {
    margin: 0 16px;
    margin-bottom: 20px;
    font-size: 16px;
    line-height: 150%;
    @include media-breakpoint-up(sm) {
      margin: 0 24px 24px 24px;
      font-size: 18px;
    }
  }

  &__info {
    padding: 16px;
    background: #f5f5f5;
    border-radius: 4px;
    @include media-breakpoint-up(sm) {
      padding: 24px;
    }

    &_title {
      margin-bottom: 24px;
      font-size: 22px;
      line-height: 31px;
      @include media-breakpoint-up(sm) {
        font-size: 24px;
        line-height: 34px;
      }
    }

    &_row {
      margin-top: 24px;
      margin-bottom: 51px;
      @include media-breakpoint-up(sm) {
        display: flex;
        margin-top: 12px;
        margin-bottom: 24px;
      }

      &_title {
        @include media-breakpoint-up(sm) {
          min-width: 180px;
        }
      }

      &_data {
        flex: 1;

        .perchase-info {
          padding: 0px;
          margin-top: 4px;
          @include media-breakpoint-up(sm) {
            margin-top: 0;
          }
        }
      }
    }

    .during {
      flex-direction: column;
      gap: 4px;
      margin-top: 24px;
      @include media-breakpoint-up(sm) {
        flex-direction: row;
        gap: 0px;
        margin-top: 12px;
      }
    }

    &_button {
      display: flex;
      justify-content: center;
      flex-direction: column;
      @include media-breakpoint-up(sm) {
        flex-direction: row;
      }
      a + a {
        margin-top: 12px;
        @include media-breakpoint-up(sm) {
          margin-top: 0;
          margin-left: 12px;
        }
      }
      .subcribe-button,
      .button {
        width: 240px;
        height: 48px;
        padding-top: 12px;
        margin: 0 auto;
        @include media-breakpoint-up(sm) {
          margin: 0;
        }
      }
    }
  }

  /deep/ .content_row__title {
    min-width: 100px;
    @include media-breakpoint-up(sm) {
      min-width: 180px;
    }
  }
}
</style>
