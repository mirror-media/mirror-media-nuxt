<template>
  <div class="subscribe-form">
    <div class="subscribe-form__wrapper">
      <div class="subscribe-form__left">
        <h2 class="subscribe-form__title">訂購項目</h2>
        <SubscribeFormMerchandiseList
          :perchasedPlan="perchasedPlan"
          :discount="discount"
        />
        <h2 class="subscribe-form__title">訂購人</h2>
        <h2 class="subscribe-form__title">收件人</h2>
        <h2 class="subscribe-form__title">寄送方式</h2>
        <h2 class="subscribe-form__title">電子發票</h2>
        <h2 class="subscribe-form__title">信用卡</h2>
      </div>
      <div class="subscribe-form__right">YO</div>
    </div>
  </div>
</template>

<script>
import SubscribeFormMerchandiseList from '~/components/SubscribeFormMerchandiseList.vue'
export default {
  components: {
    SubscribeFormMerchandiseList,
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
  },
}
</script>

<style lang="scss" scoped>
.subscribe-form {
  padding: 10px 8px;
  &__wrapper {
    max-width: 991px;
    margin: auto;
    display: flex;
    flex-direction: column-reverse;

    @include media-breakpoint-up(sm) {
    }
    @include media-breakpoint-up(md) {
      flex-direction: row;
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
  }

  &__right {
    background: gold;
    width: 100%;
    flex: 1;

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
