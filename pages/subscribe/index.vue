<template>
  <div class="subscribe-choose">
    <template v-if="doesHaveIsPayByAppValue">
      <SubscribeStepProgress :currentStep="1" />
      <ClientOnly>
        <template v-if="isPayByApp">
          <div class="subscribe-choose__textcard">
            <SubscribeWrapper>
              <h6 class="subscribe-choose__textcard_title">想要變更方案嗎？</h6>
              <div class="subscribe-choose__textcard_description">
                由於您先前於 APP 購買，如要變更方案，請至 App Store (iOS 系統)
                或 Google Play (Android 系統) 操作。
              </div>
              <UiMembershipButtonPrimary
                class="subscribe-choose__textcard_back"
                @click.native="handleGoToSectionMember"
              >
                回會員專區
              </UiMembershipButtonPrimary>
            </SubscribeWrapper>
          </div>
        </template>
        <template v-else-if="memberStatus !== 'year'">
          <div class="subscribe-choose__wrapper">
            <h2
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
                @subscribePlan="handleSubscribePlan"
                @login="handleLogin"
              />
            </div>
          </div>
          <UiSubscribeInfo type="membership" :infoList="infoList" />
        </template>
        <template v-else>
          <div class="subscribe-choose__textcard">
            <SubscribeWrapper>
              <h6 class="subscribe-choose__textcard_title">想要變更方案嗎？</h6>
              <div class="subscribe-choose__textcard_description">
                您目前訂閱的方案為<span>鏡週刊 Premium 服務-年訂閱方案</span
                >。如需變更，請先取消目前的方案，再重新訂閱新的方案。
              </div>
              <UiMembershipButtonPrimary
                class="subscribe-choose__textcard_back"
                @click.native="handleSet"
              >
                前往付款設定
              </UiMembershipButtonPrimary>
            </SubscribeWrapper>
          </div>
        </template>
      </ClientOnly>
    </template>

    <!-- if fetch is not complete, show loading-->
    <UiLoadingCover v-if="$fetchState.pending" />
  </div>
</template>

<script>
import { computed, useStore } from '@nuxtjs/composition-api'
import SubscribeStepProgress from '~/components/SubscribeStepProgress.vue'
import SubscribeMembershipChoosePlanCard from '~/components/SubscribeMembershipChoosePlanCard.vue'
import UiSubscribeInfo from '~/components/UiSubscribeInfo.vue'
import SubscribeWrapper from '~/components/SubscribeWrapper.vue'
import UiMembershipButtonPrimary from '~/components/UiMembershipButtonPrimary.vue'
import UiLoadingCover from '~/components/UiLoadingCover.vue'

export default {
  middleware: ['handle-go-to-marketing'],
  components: {
    SubscribeStepProgress,
    UiSubscribeInfo,
    SubscribeMembershipChoosePlanCard,
    SubscribeWrapper,
    UiMembershipButtonPrimary,
    UiLoadingCover,
  },
  setup() {
    const memberStatus = useMemberStatus()

    return {
      memberStatus,
    }

    function useMemberStatus() {
      const { state, getters } = useStore()
      const memberStatus = computed(() => computeMemberStatus(state, getters))
      return memberStatus

      function computeMemberStatus(state, getters) {
        if (!getters?.['membership/isLoggedIn']) {
          return 'not-member'
        } else if (
          state?.['membership-subscribe']?.basicInfo?.type ===
          'subscribe_yearly'
        ) {
          return 'year'
        } else {
          return 'basic'
        }
      }
    }
  },
  async fetch() {
    // check if user's subscription is paid by mobile
    const isMemberPaidWithMobile =
      await this.$isMemberPaidSubscriptionWithMobile()
    this.isPayByApp = isMemberPaidWithMobile
  },
  data() {
    return {
      planList: [
        {
          title: 'Premium 會員',
          details: [
            { text: '支持鏡週刊報導精神' },
            { text: '暢讀鏡週刊獨家報導' },
            { text: '兩本一冊好文分類流暢閱讀' },
            { text: '隨身攜帶讀物' },
            { text: '全台唯一綜合類型雜誌' },
            { text: '每期只要 $35 元' },
            { text: '年方案定價$2,600元，限時優惠$1,800' },
          ],
          buttons: [
            {
              title: '訂閱年方案',
              hint: '優惠 $1800 元',
            },
          ],
        },
      ],
      infoList: [
        {
          id: 0,
          text: '一年訂閱方案（52期）。',
          style: 'normal',
        },
        {
          id: 1,
          text: '每週三當日上架閱讀，惟本公司保留調整上架時間之權利。',
          style: 'normal',
        },
        {
          id: 2,
          text: '本次訂閱同時開啟屆期自動續訂及付費功能，原訂閱期滿將依據原訂閱方案自動扣款。如有特殊需求請洽本公司客服人員。',
          style: 'warning',
        },
        {
          id: 3,
          text: '如有訂閱及退款相關問題，請洽客服信箱service@mirrormedia.mg或電: (02) 6633-3882，有專人為您服務。服務時間：週一～週五 10:00~18:00、國定例假日',
          style: 'normal',
        },
        {
          id: 4,
          text: '服務時間：週一～週五 10:00~18:00、國定例假日',
          style: 'normal',
        },
      ],
      isPayByApp: undefined,
    }
  },
  computed: {
    planShowed() {
      let planShowed = []
      switch (this.memberStatus) {
        case 'basic':
          planShowed = [
            {
              title: 'Premium 會員',
              details: [
                { text: '支持鏡週刊報導精神' },
                { text: '暢讀鏡週刊獨家報導' },
                { text: '兩本一冊好文分類流暢閱讀' },
                { text: '隨身攜帶讀物' },
                { text: '全台唯一綜合類型雜誌' },
                { text: '每期只要 $35 元' },
                { text: '年方案定價$2,600元，限時優惠$1,800' },
              ],
              buttons: [
                {
                  title: '訂閱年方案',
                  hint: '優惠 $1800 元',
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
                { text: '支持鏡週刊報導精神' },
                { text: '暢讀鏡週刊獨家報導' },
                { text: '兩本一冊好文分類流暢閱讀' },
                { text: '隨身攜帶讀物' },
                { text: '全台唯一綜合類型雜誌' },
                { text: '每期只要 $35 元' },
                { text: '年方案定價$2,600元，限時優惠$1,800' },
              ],
              buttons: [
                {
                  title: '訂閱年方案',
                  hint: '優惠 $799 元',
                },
              ],
            },
            {
              title: 'Basic 會員',
              details: [
                { text: '支持鏡週刊報導精神' },
                { text: '好文解鎖 隨心所欲' },
                {
                  text: '$10 元可享單篇好文 14 天無限瀏覽',
                },
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

    hintUnderButton() {
      return null
    },
    doesHaveIsPayByAppValue() {
      return this.isPayByApp !== undefined
    },
  },
  async created() {
    if (process.server) return
    try {
      if (this.memberStatus !== 'none') {
        this.memberShipStatus = await this.$getMemberShipStatus(
          this.memberStatus
        )
      }
    } catch (error) {
      console.error(error)
    }
  },

  methods: {
    handleGoToSectionMember() {
      window.location.assign('/section/member')
    },
    handleLogin() {
      window.location.assign(`/login?destination=${this.$route.fullPath}`)
    },
    handleSet() {
      window.location.assign(`/subscribe/set`)
    },
    handleSubscribePlan(plan) {
      window.location.assign(`/subscribe/info?plan=${getEventType(plan.title)}`)

      function getEventType(planTitle) {
        const eventMap = {
          訂閱年方案: 'yearly',
        }
        return eventMap[planTitle]
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.subscribe-choose {
  min-height: calc(100vh - 150px);
  @include media-breakpoint-up(sm) {
    min-height: calc(100vw - 850px);
  }
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
      margin-bottom: 48px;
      @include media-breakpoint-up(md) {
        flex-direction: row;
        margin-bottom: 60px;
      }
      div + div {
        margin-top: 16px;
        @include media-breakpoint-up(md) {
          margin-top: 0;
          margin-left: 24px;
        }
      }
    }
  }

  &__textcard {
    padding: 40px 20px 0 20px;
    @include media-breakpoint-up(sm) {
      min-height: calc(100vw - 850px);
      padding: 80px;
    }

    &_title {
      font-size: 20px;
      line-height: 32px;
      color: rgba(0, 0, 0, 0.87);
    }

    &_description {
      margin: 4px 0 24px 0;
      color: rgba(0, 0, 0, 0.66);
    }

    &_back {
      margin: 0 auto;
      width: 240px;
      height: 48px;
    }

    span {
      color: #054f77;
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
