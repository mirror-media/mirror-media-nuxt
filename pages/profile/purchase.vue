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
      <UiMembershipUpgradeToPremium
        v-else
        :messageTitle="'找不到相關紀錄'"
        @upgrade="sendMembershipSubscribe('升級Premium會員')"
      />
    </ClientOnly>
  </div>
</template>

<script>
import { computed } from '@nuxtjs/composition-api'

import SubscribeWrapper from '~/components/SubscribeWrapper.vue'
import MemberShipStatus from '~/components/MemberShipStatus.vue'
import MembershipPosts from '~/components/MembershipPosts.vue'
import MembershipPayRecord from '~/components/MembershipPayRecord.vue'
import UiMembershipUpgradeToPremium from '~/components/UiMembershipUpgradeToPremium.vue'
import { useMemberSubscribeMachine } from '~/xstate/member-subscribe/compositions'

export default {
  middleware: ['authenticate', 'handle-go-to-marketing'],
  components: {
    SubscribeWrapper,
    MemberShipStatus,
    MembershipPosts,
    MembershipPayRecord,
    UiMembershipUpgradeToPremium,
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
