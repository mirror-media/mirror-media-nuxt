<template>
  <div class="pay-record">
    <div class="pay-record__title">
      <div class="pay-record__title_status">付款紀錄</div>
    </div>
    <div class="pay-record__form">
      <UiMembershipPayRecordList
        v-show="!isMobile"
        :pay="payListTitle"
        :isTitleRow="true"
      />
      <UiMembershipPayRecordList
        v-for="(pay, index) in payRecords"
        :key="index"
        :pay="pay"
        :showMorePostButton="true"
      />
      <div
        v-show="showMorePayRecordButton"
        class="pay-record__form_row load-more"
        @click="$emit('load-more-record')"
      >
        <span>展開更多</span>
        <img src="~/assets/arrow-down-default.svg" />
      </div>
    </div>
  </div>
</template>

<script>
import UiMembershipPayRecordList from '~/components/UiMembershipPayRecordList.vue'
export default {
  components: {
    UiMembershipPayRecordList,
  },
  props: {
    payRecords: {
      type: Array,
      require: true,
      default: () => [],
    },
    showMorePayRecordButton: {
      type: Boolean,
      default: false,
    },
    isMobile: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      payListTitle: {
        date: '購買日期',
        number: '訂單編號',
        method: '支付方式',
        price: '金額',
        type: '',
        methodNote: '',
      },
    }
  },
}
</script>

<style lang="scss" scoped>
.pay-record {
  &__title {
    &_status {
      font-weight: 600;
      font-size: 18px;
      line-height: 25px;
      color: rgba(0, 0, 0, 0.66);
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
      div + div {
        margin-left: 16px;
      }
      &:first-child {
        padding-bottom: 8px;
      }
      &:not(:first-child) {
        padding-top: 12px;
        color: rgba(0, 0, 0, 0.5);
        border-top: 1px solid rgba(0, 0, 0, 0.1);
      }
      &:nth-child(2) {
        border-top: 1px solid rgba(0, 0, 0, 0.5) !important;
      }
      &:not(last-child) {
        padding-bottom: 12px;
      }
      a {
        color: #054f77;
      }
    }
    .load-more {
      color: #054f77;
      justify-content: center;
      cursor: pointer;
      display: flex;
      width: auto;
      img {
        margin-left: 2px;
      }
    }
  }
}
</style>
