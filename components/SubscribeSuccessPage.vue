<template>
  <section>
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
          <a
            v-if="false"
            href="/section/member"
            @click.once="useCustomEventToFbPixel('back-to-Premium-page')"
          >
            <UiSubscribeButton title="瀏覽 Premium 會員文章" />
          </a>
          <a
            href="/profile/purchase"
            @click.once="
              useCustomEventToFbPixel('back-to-profile-purchase-page')
            "
          >
            <UiMembershipButtonSecondary>
              <p v-if="false">回訂閱紀錄</p>
              <p v-else>回訂閱紀錄看購買文章</p>
            </UiMembershipButtonSecondary>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import SubscribeSuccessOrderInfoContentRow from '~/components/SubscribeSuccessOrderInfoContentRow.vue'
import MembershipFormPerchaseInfo from '~/components/MembershipFormPerchaseInfo.vue'
import UiSubscribeButton from '~/components/UiSubscribeButton.vue'
import UiMembershipButtonSecondary from '~/components/UiMembershipButtonSecondary.vue'
import { useCustomEventToFbPixel } from '~/composition/fb-pixel.js'
export default {
  setup() {
    return {
      useCustomEventToFbPixel,
    }
  },
  components: {
    SubscribeSuccessOrderInfoContentRow,
    MembershipFormPerchaseInfo,
    UiSubscribeButton,
    UiMembershipButtonSecondary,
  },
  props: {
    orderInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      isUpgradeFromMonthToYear: true,
    }
  },
  computed: {
    orderPlanPrice() {
      let orderPlanPrice
      if (this.orderInfo?.amount) {
        orderPlanPrice = this.orderInfo?.amount
      } else {
        switch (this.orderInfo.frequency) {
          // set default price if can not fetch orderInfo
          case 'one time': {
            orderPlanPrice = 5
            break
          }
          case 'monthly': {
            orderPlanPrice = 49
            break
          }
          case 'yearly': {
            orderPlanPrice = 499
            break
          }
        }
      }

      return orderPlanPrice
    },
    perchasedList() {
      switch (this.orderInfo.frequency) {
        case 'one_time': {
          return [
            {
              detail: '鏡週刊Basic會員（單篇）',
              hint: `$${this.orderPlanPrice} 元可享單篇好文 14 天無限瀏覽`,
              price: `原價 NT$${this.orderPlanPrice}`,
              newPrice: this.orderPlanPrice,
              key: 'basic',
            },
          ]
        }
        case 'monthly': {
          return [
            {
              detail: '鏡週刊Premium會員（月方案）',
              hint: `每月 $${this.orderPlanPrice} 元，信用卡自動續扣`,
              price: '原價 NT$99',
              newPrice: this.orderPlanPrice,
              key: 'month',
            },
          ]
        }
        case 'yearly': {
          return [
            {
              detail: '鏡週刊Premium會員（年方案）',
              hint: `每年 $${this.orderPlanPrice} 元，信用卡自動續扣`,
              price: '原價 NT$1188',
              newPrice: this.orderInfo.amount,
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
        return '訂單處理中，請稍候在訂閱紀錄確認訂單狀況。'
      } else {
        return '您已完成付款，以下為本次訂購資訊，已同步寄送至您的信箱。'
      }
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

    // .during {
    //   flex-direction: column;
    //   gap: 4px;
    //   margin-top: 24px;
    //   @include media-breakpoint-up(sm) {
    //     flex-direction: row;
    //     gap: 0px;
    //     margin-top: 12px;
    //   }
    // }

    &_button {
      display: flex;
      justify-content: center;
      flex-direction: column;
      @include media-breakpoint-up(sm) {
        flex-direction: row;
      }
      & > * + * {
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

  ::v-deep .content_row__title {
    min-width: 100px;
    @include media-breakpoint-up(sm) {
      min-width: 180px;
    }
  }
}
</style>
