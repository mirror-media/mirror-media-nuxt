<template>
  <div class="order-success">
    <div class="order-success__wrapper">
      <p class="order-success__wrapper--red-font">
        您已完成付款，以下為本次訂購資訊：
        <br />
        您將收到完成訂閱通知信、付款完成通知信、電子發票開立通知信。若無收到請檢查該郵件是否被過濾成垃圾郵件。
      </p>
      <SubscribeSuccessOrderInfo
        :orderInfo="orderInfo"
        :orderInfoPurchasedList="orderInfoPurchasedList"
        :customerInfo="customerInfo"
      />

      <UiSubscribeInfo type="papermag" :infoList="infoList" />
    </div>
  </div>
</template>

<script>
import UiSubscribeInfo from '~/components/UiSubscribeInfo.vue'
import SubscribeSuccessOrderInfo from '~/components/SubscribeSuccessOrderInfo.vue'
export default {
  components: {
    UiSubscribeInfo,
    SubscribeSuccessOrderInfo,
  },
  props: {
    orderInfo: {
      type: Object,
      isRequired: true,
      default: () => {
        return {}
      },
    },
    orderInfoPurchasedList: {
      type: Array,
      default: () => [],
    },
    customerInfo: {
      type: Object,
      default: () => {
        return {
          pur_name: '',
          pur_mail: '',
          pur_cell: '',
          pur_addr: '',
          rec_name: '',
          rec_cell: '',
          rec_addr: '',
        }
      },
    },
  },
  data() {
    return {
      infoList: [
        {
          id: 0,
          text: '完成訂購後，開始寄送期數將由服務人員提供。',
        },
        {
          id: 1,
          text:
            '雜誌每週三出刊，將於週四(含)前完成寄送，若當週五仍未收到，請來電查詢。',
        },
        {
          id: 2,
          text:
            '若需更改收件地址，請於每週四中午12:00前來電，我們將於下週寄送至新址。',
        },
        {
          id: 3,
          text:
            '訂單成立後，會收到我們email給您的確認信。手機號碼及電子信箱請務必正確填寫，若無收到信請檢查該郵件是否被過濾成垃圾郵件。',
        },
        {
          id: 4,
          text:
            '紙本訂戶專線：(02) 6633-3882，電子信箱： service@mirrormedia.mg',
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.order-success {
  position: relative;
  padding: 13px 8px;
  @include media-breakpoint-up(sm) {
    padding: 18px 8px;
  }
  &__wrapper {
    max-width: 990px;
    margin: auto;
    &--red-font {
      padding: 0 17px;
      margin-bottom: 13px;
      font-size: 18px;
      line-height: 1.87;
      text-align: justify;
      color: red;
      @include media-breakpoint-up(sm) {
        padding: 0 25px;
        margin-bottom: 18px;
      }
    }
    .order-info {
      margin-bottom: 18px;
      @include media-breakpoint-up(sm) {
        margin-bottom: 36px;
      }
    }
  }
}
</style>
