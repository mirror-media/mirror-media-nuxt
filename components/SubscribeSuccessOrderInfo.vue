<template>
  <div class="order-info">
    <div class="order-info-order">
      <div class="info__title">訂單資訊</div>
      <div class="info__content">
        <div class="content__row">
          <div class="content__title">訂單編號</div>
          <div class="content__data">{{ orderId }}</div>
        </div>
        <div class="content__row">
          <div class="content__title">續訂戶代碼</div>
          <div class="content___data">窩不知道</div>
        </div>
        <div class="content__row">
          <div class="content__title">訂單日期</div>
          <div class="content___data">
            {{ orderDate }}
          </div>
        </div>
        <div class="content__row order-detail">
          <div class="content__title">訂單內容</div>
          <div class="content__data">
            <div class="perchased-form">
              <div
                v-for="item of orderInfo.perchasedPlan"
                :key="item.id"
                class="perchased-form__row"
              >
                <div>{{ item.detail }} X {{ item.count }}</div>
                <div>NT$ {{ item.newPrice * item.count }}</div>
              </div>
              <div class="perchased-form__row ship-cost">
                <div>運費</div>
                <div>NT$ {{ orderInfo.shipPlan.cost }}</div>
              </div>
              <div class="perchased-form__row">
                <div>總計</div>
                <div>NT$ {{ totalCost }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="order-info-user">
      <div class="info__title">顧客資訊</div>
      <div class="info__content">
        <div class="info__subtitle">訂購人</div>
        <div class="content__row">
          <div class="content__title">姓名</div>
          <div class="content__data">{{ orderInfo.ordererData.name }}</div>
        </div>
        <div class="content__row">
          <div class="content__title">電子信箱</div>
          <div class="content__data">{{ orderInfo.ordererData.email }}</div>
        </div>
        <div class="content__row">
          <div class="content__title">聯絡電話</div>
          <div class="content__data">{{ orderInfo.ordererData.cellphone }}</div>
        </div>
      </div>
      <div class="info__content">
        <div class="info__subtitle">收件人</div>
        <div class="content__row">
          <div class="content__title">姓名</div>
          <div class="content__data">{{ orderInfo.receiverData.name }}</div>
        </div>
        <div class="content__row">
          <div class="content__title">聯絡電話</div>
          <div class="content__data">
            {{ orderInfo.receiverData.cellphone }}
          </div>
        </div>
        <div class="content__row">
          <div class="content__title">通訊地址</div>
          <div class="content__data">{{ orderInfo.receiverData.address }}</div>
        </div>
        <div class="content__row">
          <div class="content__title">派送備註</div>
          <div class="content__data">這裡要放什麼嗎</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
      return new Date().format('yyyy-MM-dd')
    },
    totalCost() {
      let total = 0
      this.orderInfo.perchasedPlan.forEach((item) => {
        total += item.newPrice * item.count
      })
      total += this.orderInfo.shipPlan.cost
      return total
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

.info__title {
  font-size: 22px;

  @include media-breakpoint-up(sm) {
    font-size: 26px;
  }
}

.info__subtitle {
  font-size: 18px;
  margin-bottom: 18px;
}

.info__content {
  margin-top: 18px;

  @include media-breakpoint-up(sm) {
    margin-top: 23px;
  }
}

.content__row {
  display: flex;
  & + & {
    margin-top: 12px;

    @include media-breakpoint-up(sm) {
      margin-top: 18px;
    }
  }
}

.order-detail {
  display: block;
  @include media-breakpoint-up(sm) {
    display: flex;
  }

  & .content__data {
    margin-top: 12px;
    @include media-breakpoint-up(sm) {
      margin-top: 0px;
    }
  }
}

.content__title {
  min-width: 97px;

  @include media-breakpoint-up(sm) {
    min-width: 150px;
  }
}

.perchased-form__row {
  display: flex;
  justify-content: space-between;

  & + & {
    margin-top: 8px;
    @include media-breakpoint-up(sm) {
      margin-top: 14px;
    }
  }
}

.content__detail {
  width: 100%;
}

.ship-cost {
  padding-bottom: 10px;
  border-bottom: solid 1px #4a4a4a;
  @include media-breakpoint-up(sm) {
    padding-bottom: 18px;
  }
}

.content__data {
  flex: 1;
}
</style>
