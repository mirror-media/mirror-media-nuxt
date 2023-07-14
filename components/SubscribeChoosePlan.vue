<template>
  <div class="choose-plan" :class="{ 'no-padding-top': shouldShowNotice }">
    <div class="choose-plan__wrapper">
      <div class="choose-plan__plan_container">
        <SubscribeChoosePlanCard
          v-for="plan in planList"
          :key="plan.id"
          :planUrl="plan.id + 1"
          :title="plan.title"
          :detail="plan.detail"
          :originalPrice="plan.originalPrice"
          :newPrice="plan.newPrice"
        />
      </div>

      <UiSubscribeInfo type="papermag" :infoList="infoList" />
    </div>
  </div>
</template>

<script>
import SubscribeChoosePlanCard from '~/components/SubscribeChoosePlanCard.vue'
import UiSubscribeInfo from '~/components/UiSubscribeInfo.vue'
export default {
  components: {
    SubscribeChoosePlanCard,
    UiSubscribeInfo,
  },
  props: {
    shouldShowNotice: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      planList: [
        {
          id: 0,
          title: '一年方案',
          detail: '訂購紙本鏡週刊 52 期，加贈 5 期',
          originalPrice: 3900,
          newPrice: 2880,
        },
        {
          id: 1,
          title: '二年方案',
          detail: '訂購紙本鏡週刊 104 期，加贈 10 期',
          originalPrice: 7800,
          newPrice: 5280,
        },
      ],
      infoList: [
        {
          id: 0,
          text: '目前無提供國外海外地區的紙本雜誌訂閱及寄送服務。',
        },
        {
          id: 1,
          text: '完成訂購後，開始寄送期數將由服務人員提供。',
        },
        {
          id: 2,
          text: '雜誌每週三出刊，將於週四(含)前完成寄送，若當週五仍未收到，請來電查詢。',
        },
        {
          id: 3,
          text: '若需更改收件地址，請於每週四中午12:00前來電，我們將於下週寄送至新址。',
        },
        {
          id: 4,
          text: '訂單成立後，會收到我們email給您的確認信。手機號碼及電子信箱請務必正確填寫。若無收到信請檢查該郵件是否被過濾成垃圾郵件。',
        },
        {
          id: 5,
          text: '雜誌的取消/退訂注意事項',
          child: [
            {
              id: 0,
              text: '雜誌未配送前可全額退款。雜誌如已開始配送，退費金額=原訂金額-(零售價$75x訂閱已配送期數)-原訂金額之5%手續費。',
            },
            {
              id: 1,
              text: '註1：訂閱已配送期數包含已進入配送作業流程的期數。',
            },
          ],
        },
        {
          id: 6,
          text: '紙本訂戶專線：(02) 6633-3882，電子信箱： service@mirrormedia.mg',
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.choose-plan {
  background: white;
  padding: 10px 8px;

  @include media-breakpoint-up(sm) {
    padding: 49px 8px 47px;
  }

  &.no-padding-top {
    padding-top: 0;
  }

  &__wrapper {
    max-width: 990px;
    margin: auto;
  }

  &__plan_container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 32px;

    @include media-breakpoint-up(sm) {
      flex-direction: row;
    }
  }
}
</style>
