<template>
  <div class="purchase">
    <ClientOnly>
      <h1 class="purchase__title">訂閱紀錄</h1>
      <SubscribeWrapper v-if="memberShipStatusName !== 'none'">
        <MemberShipStatus
          :isMobile="isMobile"
          :memberShipStatus="memberShipStatus"
          :isPremium="isPremium"
          @upgradeInSinglePost="handleGoToSubscribe"
          @upgradeToSubscribeYearly="handleGoToSubscribe"
          @navigateToSubscribeSet="handleNavigateToSubscribeSet"
        />
        <MembershipPosts
          v-if="postList.length && !isPremium"
          :postList="showedPostList"
          :showMorePostButton="showMorePostButton"
          @load-more-post="handleMorePost"
        />
        <div class="pay-record__title">
          <div class="pay-record__title_status">付款紀錄</div>
          <p class="pay-record__text">
            如想了解您在 Apple Store 購買的訂單資訊，請至
            <a
              href="https://www.apple.com/tw/app-store/"
              target="_blank"
              rel="noreferrer noopener"
            >
              Apple Store
            </a>
            查看。
          </p>
        </div>
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
        @upgrade="handleGoToSubscribe"
      />
    </ClientOnly>
  </div>
</template>

<script>
import SubscribeWrapper from '~/components/SubscribeWrapper.vue'
import MemberShipStatus from '~/components/MemberShipStatus.vue'
import MembershipPosts from '~/components/MembershipPosts.vue'
import MembershipPayRecord from '~/components/MembershipPayRecord.vue'
import UiMembershipUpgradeToPremium from '~/components/UiMembershipUpgradeToPremium.vue'
import { MemberType } from '~/constants/common'

export default {
  middleware: ['authenticate', 'handle-go-to-marketing'],
  components: {
    SubscribeWrapper,
    MemberShipStatus,
    MembershipPosts,
    MembershipPayRecord,
    UiMembershipUpgradeToPremium,
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
        status === MemberType.Yearly ||
        status === MemberType.Monthly ||
        status === MemberType.Disturbed
      )
    },
    isBasic() {
      const status = this.memberShipStatusName
      return status === MemberType.OneTime
    },
    showedPostList() {
      return this.postList.slice(0, this.postMetaCount)
    },
    showedPayRecords() {
      return this.payRecords.slice(0, this.payRecordMetaCount)
    },
    memberShipStatusName() {
      return (
        this.$store.state?.['membership-subscribe']?.basicInfo?.type ??
        MemberType.None
      )
    },
  },

  async created() {
    if (process.server) return

    try {
      if (this.isPremium || this.isBasic) {
        this.memberShipStatus = await this.$getMemberShipStatus(
          this.memberShipStatusName
        )
        if (this.isBasic) {
          // fetch onetime subscription list
          this.postList = await this.$getMemberOneTimeSubscriptions({})

          if (this.$config.purchaseOneTimeFeatureToggle) {
            const resultOfK6 = await this.$getMemberOneTimeSubscriptionsK6({})
            this.postList = [...this.postList, ...resultOfK6]
          }
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
    handleNavigateToSubscribeSet() {
      window.location.assign('/subscribe/set')
    },
    handleGoToSubscribe() {
      window.location.assign('/subscribe')
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

.pay-record {
  &__title {
    &_status {
      font-weight: 600;
      font-size: 18px;
      line-height: 25px;
      color: rgba(0, 0, 0, 0.66);
      margin: 0 !important;
    }
  }
  &__text {
    font-size: 13px;
    line-height: 18px;
    color: rgba(0, 0, 0, 0.5);
    margin: 8px 0 0 0;
    a {
      color: #054f77;
    }
  }
}
</style>
