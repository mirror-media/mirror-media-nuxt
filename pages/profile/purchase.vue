<template>
  <div class="purchase">
    <h1 class="purchase__title">訂閱紀錄</h1>
    <SubscribeWrapper v-if="memberShipStatus.name !== 'not-at-all'">
      <MemberShipStatus
        :isMobile="isMobile"
        :memberShipStatus="memberShipStatus"
        :isPremium="isPremium"
      />
      <MembershipPosts
        v-if="postList.length && !isPremium"
        :postList="postList"
        :showMorePostButton="showMorePostButton"
        @load-more-post="handleMorePost"
      />
      <MembershipPayRecord
        v-if="payRecords.length"
        :payRecords="payRecords"
        :isMobile="isMobile"
        :showMorePayRecordButton="showMorePayRecordButton"
        @load-more-record="handleMoreRecord"
      />
    </SubscribeWrapper>
    <template v-else>
      <div class="purchase__message">找不到相關紀錄</div>
      <div class="purchase__upgrade">
        <div class="purchase__upgrade_title">
          準備好升級為鏡週刊 Premium 會員了嗎？
        </div>
        <div class="purchase__upgrade_content">
          每月 $49 元，暢享專區零廣告閱讀、優質報導看到飽
        </div>
        <a href="/subscribe">
          <UiMembershipButtonPrimary
            >升級 Premium 會員</UiMembershipButtonPrimary
          ></a
        >
      </div>
    </template>
    <MembershipSimFormStatus
      v-if="showSimFormStatus"
      @change-status="setMembershipStatus"
    />
  </div>
</template>

<script>
import { ENV } from '~/configs/config'
import SubscribeWrapper from '~/components/SubscribeWrapper.vue'
import MemberShipStatus from '~/components/MemberShipStatus.vue'
import MembershipPosts from '~/components/MembershipPosts.vue'
import MembershipPayRecord from '~/components/MembershipPayRecord.vue'
import MembershipSimFormStatus from '~/components/MembershipSimFormStatus.vue'
import UiMembershipButtonPrimary from '~/components/UiMembershipButtonPrimary.vue'

export default {
  components: {
    SubscribeWrapper,
    MemberShipStatus,
    MembershipPosts,
    MembershipPayRecord,
    MembershipSimFormStatus,
    UiMembershipButtonPrimary,
  },
  data() {
    return {
      memberShipStatus: {
        name: 'single-post',
        dueDate: null,
        nextPayDate: null,
        payMethod: null,
      },
      postList: [
        {
          id: 1,
          title: '【搞懂特別股】股神也押寶大賺　特別股成投資市場新寵',
          href: '/',
          deadline: '2022/12/3 15:02',
        },
        {
          id: 2,
          title: '【全文】當蘋果落下　香港新聞自由告終',
          href: '/',
          deadline: '2021/5/29 12:29',
        },
        {
          id: 3,
          title: '【鏡相人間】臉被偷走之後　台灣Deepfake事件獨家調查',
          href: '/',
          deadline: '2022/12/3 15:02',
        },
        {
          id: 4,
          title: '【名媛教育番外篇】孫怡談台灣《Vogue》改版：紙本才是實驗場！',
          href: '/',
          deadline: '2022/12/3 15:02',
        },
        {
          id: 5,
          title: '【國安法下的香港人3】香港的膏肓　阿樂',
          href: '/',
          deadline: '2022/12/3 15:02',
        },
      ],
      postMetaCount: 6,
      payRecords: [
        {
          number: 'M202107160001',
          date: '2022/12/29',
          type: '年訂閱',
          method: '信用卡自動續扣',
          methodNote: '(1092)',
          price: 490,
        },
        {
          number: 'M202107160002',
          date: '2022/12/29',
          type: '年訂閱',
          method: '信用卡自動續扣',
          methodNote: '1092',
          price: 490,
        },
        {
          number: 'M202107160003',
          date: '2022/12/29',
          type: '年訂閱',
          method: '信用卡自動續扣',
          methodNote: '1092',
          price: 490,
        },
        {
          number: 'M202107160001',
          date: '2022/12/29',
          type: '年訂閱',
          method: '信用卡自動續扣',
          methodNote: '(1092)',
          price: 490,
        },
        {
          number: 'M202107160001',
          date: '2022/12/29',
          type: '年訂閱',
          method: '信用卡自動續扣',
          methodNote: '(1092)',
          price: 490,
        },
        {
          number: 'M202107160001',
          date: '2022/12/29',
          type: '年訂閱',
          method: '信用卡自動續扣',
          methodNote: '(1092)',
          price: 490,
        },
        {
          number: 'M202107160001',
          date: '2022/12/29',
          type: '年訂閱',
          method: '信用卡自動續扣',
          methodNote: '(1092)',
          price: 490,
        },
        {
          number: 'M202107160001',
          date: '2022/12/29',
          type: '年訂閱',
          method: '信用卡自動續扣',
          methodNote: '(1092)',
          price: 490,
        },
        {
          number: 'M202107160001',
          date: '2022/12/29',
          type: '年訂閱',
          method: '信用卡自動續扣',
          methodNote: '(1092)',
          price: 490,
        },
        {
          number: 'M202107160001',
          date: '2022/12/29',
          type: '年訂閱',
          method: '信用卡自動續扣',
          methodNote: '(1092)',
          price: 490,
        },
      ],
      payRecordMetaCount: 11,
      isMobile: false,
    }
  },
  mounted() {
    if (this.$store.state.viewport.width <= 568) {
      this.isMobile = true
    }
  },
  computed: {
    showMorePostButton() {
      return this.postMetaCount > this.postList.length
    },
    showMorePayRecordButton() {
      return this.payRecordMetaCount > this.payRecords.length
    },
    showSimFormStatus() {
      return ENV === 'local'
    },
    isPremium() {
      const status = this.memberShipStatus.name
      return status === 'year' || status === 'month' || status === 'disturb'
    },
  },
  methods: {
    handleMorePost() {
      this.postList.push({
        id: 6,
        title: '【鏡相人間】臉被偷走之後　台灣Deepfake事件獨家調查',
        href: '/',
        deadline: '2022/12/3 15:02',
      })
    },
    handleMoreRecord() {
      this.payRecords.push({
        number: 'M202107160001',
        date: '2022/12/29',
        type: '年訂閱',
        method: '信用卡自動續扣',
        methodNote: '(1092)',
        price: 490,
      })
    },
    setMembershipStatus(val) {
      this.memberShipStatus.name = val
      switch (val) {
        case 'year':
          this.memberShipStatus = {
            name: 'year',
            dueDate: '至 2022/12/29',
            nextPayDate: '2022/7/30',
            payMethod: '信用卡自動續扣(2924)',
          }
          break
        case 'month':
          this.memberShipStatus = {
            name: 'month',
            dueDate: '至 2022/12/29',
            nextPayDate: '2022/7/30',
            payMethod: '信用卡自動續扣(2924)',
          }
          break
        case 'disturb':
          this.memberShipStatus = {
            name: 'disturb',
            dueDate: '至 2022/12/29',
            nextPayDate: null,
            payMethod: null,
          }
          break
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.purchase {
  min-height: calc(100vw - 150px);
  margin: 0 auto;
  max-width: 680px;
  padding: 40px 20px 20px 20px;
  @include media-breakpoint-up(md) {
    padding: 24px 0;
    max-width: 600px;
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
      width: 320px;
    }
  }

  .subscribe-wrapper {
    width: 100%;
    border: 0;
    padding: 0;
    @include media-breakpoint-up(md) {
      border: 1px solid rgba(0, 0, 0, 0.1);
      padding: 24px 24px 16px 24px;
    }

    div {
      &:not(:last-child) {
        margin-bottom: 48px;
      }
    }
  }
}
</style>
