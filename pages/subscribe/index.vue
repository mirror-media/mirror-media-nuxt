<template>
  <div class="subscribe-choose">
    <template v-if="!canShowFeat && doesHaveIsPayByAppValue">
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
                >回會員專區</UiMembershipButtonPrimary
              >
            </SubscribeWrapper>
          </div>
        </template>
        <template v-else-if="memberStatus !== 'year'">
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
                @subscribePlan="handleSubscribePlan"
                @login="sendMembershipSubscribe('點擊免費加入會員')"
              />
            </div>
          </div>
          <UiSubscribeInfo type="membership" :infoList="infoList" />
        </template>
        <template v-else>
          <div class="subscribe-choose__year">
            <SubscribeWrapper>
              <h6 class="subscribe-choose__year_title">取想要變更方案嗎？</h6>
              <div class="subscribe-choose__year_description">
                您目前訂閱的方案為<span>鏡週刊 Premium 服務-年訂閱方案</span
                >。如需變更，請先取消目前的方案，再重新訂閱新的方案。
              </div>
              <UiMembershipButtonPrimary
                class="subscribe-choose__year_back"
                @click.native="handleSet"
                >前往付款設定</UiMembershipButtonPrimary
              >
            </SubscribeWrapper>
          </div>
        </template>
      </ClientOnly>
    </template>

    <!-- if fetch is not complete, show loading-->
    <UiLoadingCover v-if="canShowFeat && $fetchState.pending" />
  </div>
</template>

<script>
import { computed } from '@nuxtjs/composition-api'
import SubscribeStepProgress from '~/components/SubscribeStepProgress.vue'
import SubscribeMembershipChoosePlanCard from '~/components/SubscribeMembershipChoosePlanCard.vue'
import UiSubscribeInfo from '~/components/UiSubscribeInfo.vue'
import SubscribeWrapper from '~/components/SubscribeWrapper.vue'
import UiMembershipButtonPrimary from '~/components/UiMembershipButtonPrimary.vue'
import UiLoadingCover from '~/components/UiLoadingCover.vue'
import { useMemberSubscribeMachine } from '~/xstate/member-subscribe/compositions'
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
    const { state, send } = useMemberSubscribeMachine()
    const memberStatus = useMemberStatus()
    return {
      stateMembershipSubscribe: state,
      sendMembershipSubscribe: send,
      memberStatus,
      handleSubscribePlan(plan) {
        send(getEventType(plan.title))

        function getEventType(planTitle) {
          const eventMap = {
            訂閱年方案: '年訂閱',
            訂閱月方案: '月訂閱',
          }
          return eventMap[planTitle]
        }
      },
      handleSet() {
        send('點擊前往付款設定頁')
      },
    }

    function useMemberStatus() {
      const { state } = useMemberSubscribeMachine()
      const memberStatus = computed(() => computeMemberStatus(state?.value))
      return memberStatus

      function computeMemberStatus(state) {
        const parentState = '會員訂閱功能.方案購買流程.方案購買頁'
        if (state?.matches(`${parentState}.未登入`)) {
          return 'not-member'
        } else if (state?.matches(`${parentState}.已登入`)) {
          const parentState = '會員訂閱功能.方案購買流程.方案購買頁.已登入'
          if (state?.matches(`${parentState}.月或年方案選擇`)) {
            return 'basic'
          } else if (state?.matches(`${parentState}.年方案選擇`)) {
            return 'month'
          } else {
            return 'year'
          }
        }
      }
    }
  },
  async fetch() {
    // check if user's subscription is paid by mobile
    const isMemberPaidWithMobile = await this.$isMemberPaidSubscriptionWithMobile()
    this.isPayByApp = isMemberPaidWithMobile
  },
  data() {
    return {
      planList: [
        {
          title: 'Premium 會員',
          details: [
            { text: '支持鏡週刊報導精神' },
            { text: '暢讀鏡週刊全站內容' },
            { text: '會員專區零廣告純淨閱覽' },
            { text: '專區好文不分頁流暢閱讀' },
            { text: '免費閱讀數位版動態雜誌' },
            { text: '月方案定價 $99 元，限時優惠 $49 元' },
            { text: '年方案定價 $1,188 元，限時優惠 $499 元' },

            {
              text: '加入年方案訂閱，就有機會獲得Sony旗艦手機',
              isHightlight: true,
            },
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
            { text: '支持鏡週刊報導精神' },
            { text: '好文解鎖 隨心所欲' },
            { text: '$1 元可享單篇好文 14 天無限瀏覽' },
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
            '月訂閱方案經會員授權扣款購買即為完成服務，因此月費會員無法退費，但可取消繼續訂閱。',
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
        {
          id: 5,
          text:
            '本抽獎活動為機會中獎活動，依中華民國稅法規定，中獎金額超過 NT$1,000元，中獎人須併入個人年度綜合所得稅申報；若中獎金額超過 NT$20,010元，中獎人須自行負擔10%之機會中獎所得稅（非中華民國境內居住之個人為20%）並配合本公司辦理代扣繳相關事宜(得獎者應先繳納中獎所得稅後，本公司方將中獎獎項提供予得獎人)。</br>中獎人須提供姓名、身分證字號、戶籍地址及身分證正、反面影本，以供本公司依法向稅捐機關進行年度申報作業。',
        },
      ],
      isPayByApp: undefined,
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
                { text: '支持鏡週刊報導精神' },
                { text: '暢讀鏡週刊全站內容' },
                { text: '會員專區零廣告純淨閱覽' },
                { text: '專區好文不分頁流暢閱讀' },
                { text: '免費閱讀數位版動態雜誌' },
                { text: '月方案定價 $99 元，限時優惠 $49 元' },
                { text: '年方案定價 $1,188 元，限時優惠 $499 元' },

                {
                  text: '加入年方案訂閱，就有機會獲得Sony旗艦手機',
                  isHightlight: true,
                },
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
                { text: '支持鏡週刊報導精神' },
                { text: '暢讀鏡週刊全站內容' },
                { text: '會員專區零廣告純淨閱覽' },
                { text: '專區好文不分頁流暢閱讀' },
                { text: '免費閱讀數位版動態雜誌' },
                { text: '月方案定價 $99 元，限時優惠 $49 元' },
                { text: '年方案定價 $1,188 元，限時優惠 $499 元' },

                {
                  text: '加入年方案訂閱，就有機會獲得Sony旗艦手機',
                  isHightlight: true,
                },
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
                { text: '支持鏡週刊報導精神' },
                { text: '暢讀鏡週刊全站內容' },
                { text: '會員專區零廣告純淨閱覽' },
                { text: '專區好文不分頁流暢閱讀' },
                { text: '免費閱讀數位版動態雜誌' },
                { text: '月方案定價 $99 元，限時優惠 $49 元' },
                { text: '年方案定價 $1,188 元，限時優惠 $499 元' },

                {
                  text: '加入年方案訂閱，就有機會獲得Sony旗艦手機',
                  isHightlight: true,
                },
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
                { text: '支持鏡週刊報導精神' },
                { text: '好文解鎖 隨心所欲' },
                { text: '$1 元可享單篇好文 14 天無限瀏覽' },
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
      switch (this.memberStatus) {
        case 'month':
          return '升級將在本次收費週期結束時生效'
        default:
          return null
      }
    },
    doesHaveIsPayByAppValue() {
      return this.isPayByApp !== undefined
    },
    canShowFeat() {
      return this.$route.query?.toggle === 'show-toggle-feature'
    },
  },
  methods: {
    handleGoToSectionMember() {
      window.location.assign('/section/member')
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
