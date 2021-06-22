<template>
  <div class="order-info">
    <div class="order-info__order">
      <div class="order-info__order_title">訂單資訊</div>
      <div class="order-info__order_content">
        <SubscribeSuccessOrderInfoContentRow title="訂單編號" :data="orderId" />
        <SubscribeSuccessOrderInfoContentRow
          title="續訂戶代碼"
          data="窩不知道"
        />
        <SubscribeSuccessOrderInfoContentRow
          title="訂單日期"
          :data="orderDate"
        />
        <SubscribeSuccessOrderInfoContentRow
          title="訂單內容"
          data=""
          :totalCost="orderInfo.price_total"
          :perchasedList="fileterPerchasedPlan"
          :shipCost="shipCost"
          class="order-info__order_content_perchased"
        />
      </div>
    </div>
    <div class="order-info__user">
      <div class="order-info__user_title">顧客資訊</div>
      <div class="order-info__user_content">
        <div class="order-info__user_content_title">訂購人</div>
        <SubscribeSuccessOrderInfoContentRow
          title="姓名"
          :data="orderInfo.pur_name"
        />
        <SubscribeSuccessOrderInfoContentRow
          title="電子信箱"
          :data="orderInfo.pur_mail"
        />
        <SubscribeSuccessOrderInfoContentRow
          title="聯絡電話"
          :data="orderInfo.pur_cell"
        />
      </div>
      <div class="order-info__user_content">
        <div class="order-info__user_content_title">收件人</div>
        <SubscribeSuccessOrderInfoContentRow
          title="姓名"
          :data="orderInfo.rec_name"
        />
        <SubscribeSuccessOrderInfoContentRow
          title="聯絡電話"
          :data="orderInfo.rec_cell"
        />
        <SubscribeSuccessOrderInfoContentRow
          title="通訊地址"
          :data="orderInfo.rec_addr"
        />
        <SubscribeSuccessOrderInfoContentRow
          title="派送備註"
          data="orderInfo.rec_remark"
        />
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import SubscribeSuccessOrderInfoContentRow from '~/components/SubscribeSuccessOrderInfoContentRow.vue'

export default {
  components: {
    SubscribeSuccessOrderInfoContentRow,
  },
  props: {
    orderInfo: {
      type: Object,
      isRequired: true,
      default: () => {
        return {}
      },
    },
    orderId: {
      type: String,
      isRequired: true,
      default: 'orderId',
    },
  },
  computed: {
    orderDate() {
      const now = new Date()
      return moment(now).format('YYYY-MM-DD')
    },
    fileterPerchasedPlan() {
      const itemList = [
        {
          id: 0,
          title: this.orderInfo.item_desc,
          detail: this.orderInfo.item_desc,
          originalPrice: 3990,
          newPrice: this.orderInfo.price,
          count: this.orderInfo.price_total / this.orderInfo.price,
        },
      ]
      console.log(itemList)
      return itemList
    },
    shipCost() {
      if (this.orderInfo.delivery === '限時專送') return 0
      return 20
    },
  },
}
</script>

<style lang="scss" scoped>
.order-info {
  position: relative;
  padding: 23px 17px;
  border-radius: 4px;
  background-color: #f5f5f5;
  min-height: 50vh;
  color: #4a4a4a;
  font-size: 15px;
  font-family: PingFangTC;

  & > * + * {
    margin-top: 42px;
  }

  @include media-breakpoint-up(sm) {
    padding: 22px 25px;
  }
}

.order-info__order_title,
.order-info__user_title {
  font-size: 22px;

  @include media-breakpoint-up(sm) {
    font-size: 26px;
  }
}

.order-info__user_content_title {
  font-size: 18px;
  margin-bottom: 18px;
}

.order-info__order_content,
.order-info__user_content {
  margin-top: 18px;
  @include media-breakpoint-up(sm) {
    margin-top: 23px;
  }
}

.order-info__order_content_perchased {
  display: block;
  @include media-breakpoint-up(sm) {
    display: flex;
  }
}
</style>
