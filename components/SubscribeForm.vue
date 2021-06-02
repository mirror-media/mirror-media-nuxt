<template>
  <div class="subscribe-form">
    <div class="subscribe-form__wrapper">
      <div class="subscribe-form__left">
        <SubscribeFormPlanList
          :perchasedPlan="perchasedPlan"
          :discount="discount"
        />
        <SubscribeFormOrdererData type="訂購人" />
        <SubscribeFormOrdererData type="收件人" />

        <SubscribeFormShip :setShipPlan="setShipPlan" />
        <SubscribeFormReceipt :setReceiptPlan="setReceiptPlan" />

        <h2 class="subscribe-form__title">信用卡</h2>
      </div>
      <div class="subscribe-form__right">
        <SubscribeFormPerchaseInfo :perchasedPlan="perchasedPlan" />
      </div>
    </div>
  </div>
</template>

<script>
import SubscribeFormPlanList from '~/components/SubscribeFormPlanList.vue'
import SubscribeFormPerchaseInfo from '~/components/SubscribeFormPerchaseInfo.vue'
import SubscribeFormOrdererData from '~/components/SubscribeFormOrdererData.vue'
import SubscribeFormShip from '~/components/SubscribeFormShip.vue'
import SubscribeFormReceipt from '~/components/SubscribeFormReceipt.vue'
export default {
  components: {
    SubscribeFormPlanList,
    SubscribeFormPerchaseInfo,
    SubscribeFormOrdererData,
    SubscribeFormShip,
    SubscribeFormReceipt,
  },
  props: {
    perchasedPlan: {
      type: Array,
      isRequired: true,
      default: () => {
        return [
          {
            id: 0,
            title: '一年方案',
            detail: '一年鏡週刊52期，加購5期方案',
            originalPrice: 3990,
            newPrice: 2880,
            count: 0,
          },
          {
            id: 1,
            title: '二年方案',
            detail: '二年鏡週刊104期，加購10期方案',
            originalPrice: 7800,
            newPrice: 5280,
            count: 0,
          },
        ]
      },
    },
    discount: {
      type: Object,
      isRequired: true,
      default: () => {
        return {
          hasCode: false,
          code: '',
        }
      },
    },
    setShipPlan: {
      type: Function,
      isRequired: true,
    },
    setReceiptPlan: {
      type: Function,
      isRequired: true,
    },
  },
  data() {
    return {
      receiverDataIsSameAsOrderer: false,
    }
  },
}
</script>

<style lang="scss">
.subscribe-form {
  padding: 10px 8px;
  @include media-breakpoint-up(sm) {
  }
  @include media-breakpoint-up(md) {
    padding: 40px 8px;
  }
  &__wrapper {
    max-width: 850px;
    margin: auto;
    display: flex;
    flex-direction: column-reverse;

    @include media-breakpoint-up(sm) {
    }
    @include media-breakpoint-up(md) {
      flex-direction: row;
    }
    @include media-breakpoint-up(lg) {
      max-width: 991px;
    }
  }

  &__left {
    width: 100%;
    flex: 2;
    flex-shrink: 0;
    margin-right: 41px;
    @include media-breakpoint-up(md) {
      max-width: 550px;
    }

    & > div {
      margin-bottom: 42px;
    }
  }

  &__right {
    width: 100%;
    flex: 1;
    margin-bottom: 26px;

    @include media-breakpoint-up(md) {
      max-width: 400px;
    }
  }

  &__title {
    font-size: 26px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #4a4a4a;
    margin-bottom: 16px;
  }
}
</style>
