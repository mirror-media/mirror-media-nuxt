<template>
  <div class="membership-status">
    <div class="membership-status__title" :class="{ mobile: isMobile }">
      <div class="membership-status__title_status">
        {{ title }}
        <img v-if="isPremium" src="~/assets/premium.svg" />
      </div>
      <div class="membership-status__title_button_group">
        <UiMembershipButtonPrimary
          v-if="canUpdateToYearly"
          @click.native="$emit('upgradeToSubscribeYearly')"
          >變更為年訂閱方案</UiMembershipButtonPrimary
        >
        <UiMembershipButtonPrimary
          v-else-if="memberShipStatus.name === 'subscribe_one_time'"
          @click.native="$emit('upgradeInSinglePost')"
          >升級 Premium 會員</UiMembershipButtonPrimary
        >
        <UiMembershipButtonSecondary
          v-if="memberShipStatus.name !== 'subscribe_one_time'"
          @click.native="$emit('navigateToSubscribeSet')"
          >付款設定</UiMembershipButtonSecondary
        >
      </div>
    </div>
    <div v-if="isPremium" class="membership-status__form">
      <div class="membership-status__form_row">
        <div>方案</div>
        <div>下次收費日</div>
        <div>支付方式</div>
      </div>
      <div class="membership-status__form_row">
        <div class="membership-status__form_row_pay">
          <div>{{ premiumPlan }}</div>
          <div div="membership-status__form_row_pay_date">
            <span>{{ memberShipStatus.dueDate }}</span>
          </div>
        </div>
        <div>{{ nullTodash(memberShipStatus.nextPayDate) }}</div>
        <div>{{ nullTodash(memberShipStatus.payMethod) }}</div>
      </div>
    </div>
    <div v-if="isDisturb" class="membership-status__form_hint">
      提醒您，您的訂閱將於本期結束後自動取消。
    </div>
    <div
      v-if="updatePrompt.isReadyToUpdate"
      class="membership-status__form_hint"
    >
      {{ updatePrompt.updateHint }}
    </div>
  </div>
</template>

<script>
import UiMembershipButtonPrimary from './UiMembershipButtonPrimary.vue'
import UiMembershipButtonSecondary from './UiMembershipButtonSecondary.vue'
export default {
  components: {
    UiMembershipButtonPrimary,
    UiMembershipButtonSecondary,
  },
  props: {
    isMobile: {
      type: Boolean,
      default: false,
    },
    memberShipStatus: {
      type: Object,
      require: true,
      default: () => {},
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    title() {
      return this.isPremium ? '會員等級：Premium會員' : '會員等級：Basic 會員'
    },
    premiumPlan() {
      return this.memberShipStatus.name === 'subscribe_yearly' ||
        this.memberShipStatus.name === 'subscribe_yearly_update_to_monthly' ||
        this.memberShipStatus.name === 'subscribe_yearly_disturb'
        ? '年訂閱'
        : '月訂閱'
    },
    canUpdateToYearly() {
      return (
        this.memberShipStatus.name === 'subscribe_monthly' ||
        this.memberShipStatus.name === 'subscribe_monthly_disturb'
      )
    },
    isDisturb() {
      return (
        this.memberShipStatus.name === 'subscribe_monthly_disturb' ||
        this.memberShipStatus.name === 'subscribe_yearly_disturb' ||
        this.memberShipStatus.name === 'disturb'
      )
    },
    updatePrompt() {
      if (this.memberShipStatus.name === 'subscribe_monthly_update_to_yearly') {
        return {
          isReadyToUpdate: true,
          updateHint: `您已成功完成年訂閱方案變更，年訂閱將於本次週期結束後生效。`,
        }
      } else if (
        this.memberShipStatus.name === 'subscribe_yearly_update_to_monthly'
      ) {
        return {
          isReadyToUpdate: true,
          updateHint: `您已成功完成月訂閱方案變更，月訂閱將於本次週期結束後生效。`,
        }
      } else return { isReadyToUpdate: false }
    },
  },
  methods: {
    nullTodash(input) {
      if (!input) return '-'
      return input
    },
  },
}
</script>

<style lang="scss" scoped>
.membership-status {
  &__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &.mobile {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
    &_status {
      font-weight: 600;
      font-size: 18px;
      line-height: 25px;
      color: rgba(0, 0, 0, 0.66);
      display: flex;
      gap: 4px;
    }
    &_button_group {
      display: flex;
      gap: 4px;
      .button {
        padding: 8px 16px;
        font-size: 16px;
        line-height: 22px;
        height: 38px;
        width: auto;
      }
    }
  }

  &__form {
    margin-top: 24px;
    font-size: 15px;
    line-height: 21px;
    color: rgba(0, 0, 0, 0.87);
    @include media-breakpoint-up(sm) {
      font-size: 16px;
      line-height: 150%;
    }
    &_row {
      display: flex;
      div {
        flex: 1;
      }
      &:first-child {
        padding-bottom: 8px;
      }
      &:nth-child(2) {
        padding-top: 12px;
        border-top: 1px solid rgba(0, 0, 0, 0.5);
        color: rgba(0, 0, 0, 0.5);
      }

      &_pay {
        @include media-breakpoint-up(sm) {
          display: flex;

          div:first-child {
            max-width: 50px;
          }
        }
        span {
          font-size: 13px;
          line-height: 18px;
        }
      }
    }
    &_hint {
      font-size: 15px;
      line-height: 21px;
      color: #e51731;
      margin-top: 16px;
      @include media-breakpoint-up(sm) {
        font-size: 16px;
        line-height: 22px;
        margin-top: 18px;
      }
    }
  }
}
</style>
