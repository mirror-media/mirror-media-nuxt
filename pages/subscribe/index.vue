<template>
  <div class="subscribe-choose">
    <SubscribeStepProgress :currentStep="1" />
    <div class="subscribe-choose__wrapper">
      <h2
        v-if="memberStatus !== 'month'"
        class="subscribe-choose__wrapper_title"
        :class="{ basic: memberStatus === 'basic' }"
      >
        方案選擇
      </h2>
      <div class="subscribe-choose__wrapper_plans">
        <SubscribeMembershipChoosePlanCard
          v-for="plan in planShowed"
          :key="plan.title"
          :title="plan.title"
          :details="plan.details"
          :buttons="plan.buttons"
          :hintUnderButton="hintUnderButton"
        />
      </div>
    </div>
    <UiSubscribeInfo type="membership" :infoList="infoList" />
    <SubscribeSimMemberStatus v-if="shouldShowSim" v-model="memberStatus" />
  </div>
</template>

<script>
import SubscribeStepProgress from '~/components/SubscribeStepProgress.vue'
import SubscribeMembershipChoosePlanCard from '~/components/SubscribeMembershipChoosePlanCard.vue'
import UiSubscribeInfo from '~/components/UiSubscribeInfo.vue'
import SubscribeSimMemberStatus from '~/components/SubscribeSimMemberStatus.vue'
const { ENV } = require('~/configs/config')

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
            '月訂閱方案經會員授權扣款購買即為完成服務，所以月費會員無法退費，但可取消繼續訂閱。',
        },
        {
          id: 2,
          text:
            '訂閱購買的同時會開啓自動續費(扣款)，在訂閱到期時將依據原訂閱方案自動扣款，並延續訂閱。',
        },
        {
          id: 3,
          text:
            '訂閱相關問題請 email 至會員專屬客服信箱 <a href = "mailto: MM-onlineservice@mirrormedia.mg" class="membership-subscribe__blue">MM-onlineservice@mirrormedia.mg</a>，我們會盡快為您協助處理。',
        },
        {
          id: 4,
          text:
            '更多詳細內容，請至<a href = "/story/service-rule/" class="membership-subscribe__blue">服務條款</a>。',
        },
      ],
    }
  },

  computed: {
    planShowed() {
      let planShowed = []
      switch (this.memberStatus) {
        case 'month':
          planShowed = [
            {
              title: '變更為年訂閱方案',
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
              ],
            },
          ]
          break
        case 'basic':
          planShowed = [
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
          ]
          break
        default:
          planShowed = [
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
          ]
      }
      return planShowed
    },
    shouldShowSim() {
      return ENV !== 'prod'
    },
    hintUnderButton() {
      switch (this.memberStatus) {
        case 'month':
          return '升級將在本次收費週期結束時生效'
        default:
          return null
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.subscribe-choose {
  &__wrapper {
    margin: 0 auto;
    padding: 60px 20px 0 20px;
    @include media-breakpoint-up(sm) {
      padding: 60px 48px 0 48px;
    }
    @include media-breakpoint-up(md) {
      max-width: 960px;
      padding: 60px 0px 0 0px;
    }

    &_title {
      padding-bottom: 32px;
      font-weight: 500;
      font-size: 32px;
      line-height: 45px;
      letter-spacing: 1.2px;
      color: rgba(0, 0, 0, 0.87);

      &.basic {
        width: 463px;
        margin: auto;
      }
    }

    &_plans {
      display: flex;
      flex-direction: column;
      justify-content: center;
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
