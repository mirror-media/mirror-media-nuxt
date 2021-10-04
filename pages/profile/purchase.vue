<template>
  <div class="purchase">
    <ClientOnly>
      <h1 class="purchase__title">訂閱紀錄</h1>
      <SubscribeWrapper v-if="memberShipStatusName !== 'none'">
        <MemberShipStatus
          :isMobile="isMobile"
          :memberShipStatus="memberShipStatus"
          :isPremium="isPremium"
          @upgradeInSinglePost="sendMembershipSubscribe('升級Premium會員')"
          @upgradeToSubscribeYearly="sendMembershipSubscribe('升級年訂閱')"
          @navigateToSubscribeSet="handleNavigateToSubscribeSet"
        />
        <MembershipPosts
          v-if="postList.length && !isPremium"
          :postList="showedPostList"
          :showMorePostButton="showMorePostButton"
          @load-more-post="handleMorePost"
        />
        <MembershipPayRecord
          v-if="payRecords.length"
          :payRecords="showedPayRecords"
          :isMobile="isMobile"
          :showMorePayRecordButton="showMorePayRecordButton"
          @load-more-record="handleMoreRecord"
        />
      </SubscribeWrapper>
      <div v-else>
        <div class="purchase__message">找不到相關紀錄</div>
        <div class="purchase__upgrade">
          <div class="purchase__upgrade_title">
            準備好升級為鏡週刊 Premium 會員了嗎？
          </div>
          <div class="purchase__upgrade_content">
            限時優惠每月$49元，優質報導零廣告看到飽
          </div>
          <UiMembershipButtonPrimary
            @click.native="sendMembershipSubscribe('升級Premium會員')"
          >
            升級 Premium 會員
          </UiMembershipButtonPrimary>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script>
import { computed } from '@nuxtjs/composition-api'

import SubscribeWrapper from '~/components/SubscribeWrapper.vue'
import MemberShipStatus from '~/components/MemberShipStatus.vue'
import MembershipPosts from '~/components/MembershipPosts.vue'
import MembershipPayRecord from '~/components/MembershipPayRecord.vue'
import UiMembershipButtonPrimary from '~/components/UiMembershipButtonPrimary.vue'
import { useMemberSubscribeMachine } from '~/xstate/member-subscribe/compositions'

export default {
  middleware: ['authenticate', 'handle-go-to-marketing'],
  components: {
    SubscribeWrapper,
    MemberShipStatus,
    MembershipPosts,
    MembershipPayRecord,
    UiMembershipButtonPrimary,
  },
  setup() {
    const { state, send } = useMemberSubscribeMachine()
    const memberShipStatusName = useMemberShipStatusName()
    return {
      stateMembershipSubscribe: state,
      sendMembershipSubscribe: send,
      memberShipStatusName,
      handleNavigateToSubscribeSet() {
        window.location.assign('/subscribe/set')
      },
    }
    function useMemberShipStatusName() {
      const { state } = useMemberSubscribeMachine()
      const memberShipStatusName = computed(() =>
        computeMemberShipStatusName(state?.value)
      )
      return memberShipStatusName

      function computeMemberShipStatusName(state) {
        const parentState = '會員訂閱功能.付款紀錄頁.已登入'
        if (state?.matches(`${parentState}.已登入（無購買紀錄）`)) {
          return 'none'
        } else if (state?.matches(`${parentState}.已登入（只有單篇購買過）`)) {
          return 'subscribe_one_time'
        } else if (state?.matches(`${parentState}.已登入（已訂閱月方案）`)) {
          return 'subscribe_monthly'
        } else if (state?.matches(`${parentState}.已登入（已訂閱年方案）`)) {
          return 'subscribe_yearly'
        } else if (
          state?.matches(`${parentState}.已登入（已訂閱但取消下期）`)
        ) {
          return 'disturb'
        } else {
          return 'none'
        }
      }
    }
  },

  data() {
    return {
      postList: [],
      postMetaCount: 5,
      payRecords: [],
      payRecordMetaCount: 4,
      isMobile: false,
      memberShipStatus: {
        name: 'none',
        dueDate: null,
        nextPayDate: null,
        payMethod: null,
      },
    }
  },
  computed: {
    showMorePostButton() {
      return this.postMetaCount < this.postList.length
    },
    showMorePayRecordButton() {
      return this.payRecordMetaCount < this.payRecords.length
    },
    isPremium() {
      const status = this.memberShipStatusName
      return (
        status === 'subscribe_yearly' ||
        status === 'subscribe_monthly' ||
        status === 'disturb'
      )
    },
    isBasic() {
      const status = this.memberShipStatusName
      return status === 'subscribe_one_time'
    },
    showedPostList() {
      return this.postList.slice(0, this.postMetaCount)
    },
    showedPayRecords() {
      return this.payRecords.slice(0, this.payRecordMetaCount)
    },
  },

  async created() {
    try {
      if (this.isPremium || this.isBasic) {
        this.memberShipStatus = await this.$getMemberShipStatus(
          this.memberShipStatusName
        )
        if (this.isBasic) {
          // fetch onetime subscription list
          this.postList = await this.$getMemberOneTimeSubscriptions({})
        }

        this.payRecords = await this.$getSubscriptionPayments({})
      }
    } catch (error) {
      console.error(error)
    }
  },
  mounted() {
    if (this.$store.state.viewport.width <= 568) {
      this.isMobile = true
    }
  },
  methods: {
    handleMorePost() {
      this.postMetaCount += 5
    },
    handleMoreRecord() {
      this.payRecordMetaCount += 5
    },
  },
}
</script>

<style lang="scss" scoped>
.purchase {
  min-height: calc(100vw - 150px);
  margin: 0 auto;
  max-width: 600px;
  padding: 40px 20px 20px 20px;
  @include media-breakpoint-up(md) {
    padding: 24px 0;
    max-width: 680px;
  }

  &__title {
    font-size: 22px;
    line-height: 30.8px;
    color: rgba(0, 0, 0, 0.66);
    margin-bottom: 12px;
    @include media-breakpoint-up(sm) {
      font-size: 24px;
      line-height: 34px;
    }
  }

  &__message {
    font-weight: 600;
    font-size: 18px;
    line-height: 25px;
    color: rgba(0, 0, 0, 0.66);
    margin-bottom: 24px;
    margin-top: 16px;
  }

  &__upgrade {
    width: 100%;
    padding: 24px 16px;
    border: 1px solid rgba(155, 155, 155, 0.2);
    box-shadow: 0px 0px 20px -4px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;

    &_title {
      font-weight: 600;
      font-size: 22px;
      line-height: 31px;
      color: #054f77;
      margin-bottom: 12px;
      @include media-breakpoint-up(sm) {
        font-size: 24px;
        line-height: 34px;
      }
    }

    &_content {
      font-size: 18px;
      line-height: 25px;
      color: rgba(0, 0, 0, 0.87);
      margin-bottom: 16px;
    }

    .button {
      max-width: 320px;
    }
  }

  .subscribe-wrapper {
    width: 100%;
    border: 0;
    padding: 0;
    @include media-breakpoint-up(md) {
      border: 1px solid rgba(0, 0, 0, 0.1);
      padding: 40px;
    }

    div {
      &:not(:last-child) {
        margin-bottom: 48px;
      }
    }
  }
}
</style>
