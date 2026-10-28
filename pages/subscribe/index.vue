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
                :campaign="plan.campaign"
                :buttons="plan.buttons"
                :hintUnderButton="hintUnderButton"
                @subscribePlan="handleSubscribePlan"
                @login="handleLogin"
              />
            </div>
          </div>
          <UiSubscribeInfo type="membership" :infoList="infoList" />
          <UiSubscribeCampaignInfo
            type="membership"
            :campaignInfoList="campaignInfoList"
          />
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
import { PLAN_YEARLY, PLAN_HALFYEARLY } from '~/constants/subscription-plans.js'
import SubscribeStepProgress from '~/components/SubscribeStepProgress.vue'
import SubscribeMembershipChoosePlanCard from '~/components/SubscribeMembershipChoosePlanCard.vue'
import UiSubscribeInfo from '~/components/UiSubscribeInfo.vue'
import UiSubscribeCampaignInfo from '~/components/UiSubscribeCampaignInfo.vue'
import SubscribeWrapper from '~/components/SubscribeWrapper.vue'
import UiMembershipButtonPrimary from '~/components/UiMembershipButtonPrimary.vue'
import UiLoadingCover from '~/components/UiLoadingCover.vue'

export default {
  middleware: ['handle-go-to-marketing'],
  components: {
    SubscribeStepProgress,
    UiSubscribeInfo,
    UiSubscribeCampaignInfo,
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
      infoList: [
        {
          id: 0,
          text: '一年訂閱方案（52期）、半年訂閱方案（26期）。',
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
          text: '如有訂閱及退款相關問題，請洽客服信箱service@mirrormedia.mg或電: (02) 6633-3882，有專人為您服務。',
          style: 'normal',
        },
        {
          id: 4,
          text: '服務時間：週一～週五 10:00~18:00',
          style: 'normal',
        },
      ],
      campaignInfoList: [
        {
          id: 0,
          text: '本活動獎項寄送地區僅限臺澎金馬地區。',
          style: 'normal',
        },
        {
          id: 1,
          text: '每週三當日上架閱讀，惟本公司保留調整上架時間之權利。',
          style: 'normal',
        },
        {
          id: 2,
          text: '本活動限單筆購買「1年期訂閱方案」之用戶參與，每單筆符合資格之訂閱訂單可獲得1次抽獎機會。參加者自取得抽獎資格起至該筆1年期訂閱期間屆滿止，該訂閱契約應持續有效。如於抽獎前取消訂閱、解除契約或完成退費者，即喪失該筆訂單之抽獎資格；如於中獎後至1年期訂閱期間屆滿前取消訂閱、解除契約或退費者，視為不符合本活動中獎資格，本公司得取消其中獎資格；獎品已交付者，本公司得要求返還獎品。',
          style: 'normal',
        },
        {
          id: 3,
          text: '本公司因辦理本活動所蒐集之活動參與者及中獎者姓名、電話、地址、身分證字號及其他個人資料，僅於辦理本活動、確認參加及中獎資格、通知中獎、寄送獎品及依法辦理所得申報、扣繳等必要範圍內蒐集、處理及利用，並依個人資料保護法及相關法令規定辦理。',
          style: 'normal',
        },
        {
          id: 4,
          text: '獎品以實物為準，不得要求更換、折現或轉讓。',
          style: 'normal',
        },
        {
          id: 5,
          text: '本訂閱服務是否適用通訊交易解除權及其合理例外情事，依消費者保護法、通訊交易解除權合理例外情事適用準則及相關法令規定辦理。',
          style: 'normal',
        },
        {
          id: 6,
          text: '鏡週刊保有最終修改、變更、活動解釋及取消本活動之權利，若有相關異動將會公告於網站，恕不另行通知。',
          style: 'normal',
        },
      ],
      isPayByApp: undefined,
    }
  },
  computed: {
    yearlyPlanCard() {
      return {
        title: 'Premium 會員',
        details: [
          { text: '支持鏡週刊報導精神' },
          { text: '暢讀鏡週刊獨家報導' },
          { text: '兩本一冊好文分類流暢閱讀' },
          { text: '隨身攜帶讀物' },
          { text: '全台唯一綜合類型雜誌' },
          { text: '理財鎖定報導' },
          { text: '每期最低只要 $35 元' },
          { text: PLAN_YEARLY.detailText },
        ],
        campaign: [
          { text: '2026/11/01-2027/01/31' },
          { text: '驚喜月月抽 iPhone Duo' },
        ],
        buttons: [
          {
            title: PLAN_YEARLY.buttonTitle,
            hint: PLAN_YEARLY.buttonHint,
          },
        ],
      }
    },
    halfYearlyPlanCard() {
      return {
        title: 'Premium 會員',
        details: [
          { text: '支持鏡週刊報導精神' },
          { text: '暢讀鏡週刊獨家報導' },
          { text: '兩本一冊好文分類流暢閱讀' },
          { text: '隨身攜帶讀物' },
          { text: '全台唯一綜合類型雜誌' },
          { text: '理財鎖定報導' },
          { text: '每期只要 $38 元' },
          { text: PLAN_HALFYEARLY.detailText },
        ],
        buttons: [
          {
            title: PLAN_HALFYEARLY.buttonTitle,
            hint: PLAN_HALFYEARLY.buttonHint,
          },
        ],
      }
    },
    planShowed() {
      switch (this.memberStatus) {
        case 'basic':
          return [this.yearlyPlanCard, this.halfYearlyPlanCard]
        default:
          return [
            this.yearlyPlanCard,
            this.halfYearlyPlanCard,
            {
              title: 'Basic 會員',
              details: [
                { text: '支持鏡週刊報導精神' },
                { text: '內容無限暢讀' },
                {
                  text: '熱門專題、人物故事、精彩報導一次掌握',
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
          訂閱半年方案: 'halfyearly',
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
</style>

<style lang="scss">
.membership-subscribe__blue {
  color: #054f77;
}
</style>
