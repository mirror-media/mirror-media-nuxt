<template>
  <div class="subscribe-choose">
    <SubscribeStepProgress :currentStep="1" />
    <div class="subscribe-choose__wrapper">
      <div class="subscribe-choose__wrapper_title">方案選擇</div>
      <div class="subscribe-choose__wrapper_plans">
        <SubscribeMembershipChoosePlanCard
          v-for="plan in planList"
          :key="plan.title"
          :title="plan.title"
          :details="plan.details"
          :buttons="plan.buttons"
        />
      </div>
    </div>
    <UiSubscribeInfo type="membership" :infoList="infoList" />
    <SubscribeSimMemberStatus v-model="memberStatus" />
  </div>
</template>

<script>
import SubscribeStepProgress from '~/components/SubscribeStepProgress.vue'
import SubscribeMembershipChoosePlanCard from '~/components/SubscribeMembershipChoosePlanCard.vue'
import UiSubscribeInfo from '~/components/UiSubscribeInfo.vue'
import SubscribeSimMemberStatus from '~/components/SubscribeSimMemberStatus.vue'

export default {
  components: {
    SubscribeStepProgress,
    UiSubscribeInfo,
    SubscribeMembershipChoosePlanCard,
    SubscribeSimMemberStatus,
  },
  data() {
    return {
      memberStatus: 'not-member',
      planList: [
        {
          title: 'Premium 會員',
          details: [
            '支持鏡週刊報導精神',
            '暢讀鏡週刊全站內容',
            '會員專區零廣告純淨閱覽',
            '專區好文不分頁流暢閱讀',
            '免費閱覽最新電子版週刊',
            '月方案定價 $99 元，限時優惠 $49 元',
            '年方案定價 $1,188 元，限時優惠 $499 元',
          ],
          buttons: [
            {
              title: '訂閱年方案',
              hint: '優惠 $499 元',
            },
            {
              title: '訂閱月方案',
              hint: '優惠 $49 元',
            },
          ],
        },
        {
          title: 'Basic 會員',
          details: [
            '支持鏡週刊報導精神',
            '好文解鎖 無須綁定 隨心所欲',
            '$1 元可享單篇好文 14 天無限瀏覽',
          ],
          buttons: [
            {
              title: '加入會員',
            },
          ],
        },
      ],
      infoList: [
        {
          id: 0,
          text: '月方案計算天數為 30 日，年方案計算天數為 365 日。',
        },
        {
          id: 1,
          text:
            '月訂閱方案不適用消費者保護法第十九條第一項通訊交易七日解除權之規定，所以月費會員可取消繼續訂閱但無法申請當月退費。',
        },
        {
          id: 2,
          text:
            '訂閱相關問題請 email 至會員專屬客服信箱 <a href = "mailto: MM-onlineservice@mirrormedia.mg" class="membership-subscribe__blue">MM-onlineservice@mirrormedia.mg</a>，我們會盡快為您協助處理。',
        },
      ],
    }
  },
  computed: {
    planShowed() {
      // switch(memberStatus) {},
      return this.planList
    },
  },
}
</script>

<style lang="scss" scoped>
.subscribe-choose {
  &__wrapper {
    margin: 0 auto;
    padding: 0 20px;
    @include media-breakpoint-up(sm) {
      padding: 0 48px;
    }
    @include media-breakpoint-up(md) {
      max-width: 960px;
      padding: 0;
    }

    &_title {
      margin: 60px 0 32px 0;
      font-weight: 500;
      font-size: 32px;
      line-height: 45px;
      letter-spacing: 1.2px;
      color: rgba(0, 0, 0, 0.87);
    }

    &_plans {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 48px;
      @include media-breakpoint-up(md) {
        flex-direction: row;
        gap: 24px;
        margin-bottom: 60px;
      }
    }
  }
}

.subscribe-info {
  margin-bottom: 48px;
  @include media-breakpoint-up(md) {
    margin-bottom: 60px;
  }
}
</style>

<style lang="scss">
.membership-subscribe__blue {
  color: #054f77;
}
</style>
