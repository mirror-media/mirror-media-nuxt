<template>
  <div class="plan-card">
    <h6 class="plan-card__title">{{ title }}</h6>

    <div class="plan-card__devider" />

    <p class="plan-card__detail">{{ detail }}</p>
    <p class="plan-card__original_price">原價 ${{ originalPrice }}</p>
    <p class="plan-card__new_price">優惠價 ${{ newPrice }}</p>

    <UiSubscribeButton
      :title="`訂購${title}`"
      hint="續訂另有優惠"
      @click.native="changePlanHandler"
    />
  </div>
</template>

<script>
import UiSubscribeButton from '~/components/UiSubscribeButton.vue'
export default {
  components: {
    UiSubscribeButton,
  },
  props: {
    title: {
      type: String,
      isRequired: true,
      default: '',
    },
    detail: {
      type: String,
      isRequired: true,
      default: '',
    },
    planUrl: {
      type: Number,
      isRequired: true,
      default: 1,
    },
    originalPrice: {
      type: Number,
      isRequired: true,
      default: 3990,
    },
    newPrice: {
      type: Number,
      isRequired: true,
      default: 2880,
    },
  },
  methods: {
    changePlanHandler() {
      this.$router.push(`/papermag/${this.planUrl}`)
    },
  },
}
</script>

<style lang="scss" scoped>
.plan-card {
  width: 100%;
  // height: 290px;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
  padding: 16px 10px 22px;
  &:last-child {
    margin-bottom: 0;
    @include media-breakpoint-up(sm) {
      margin-bottom: 10px;
    }
  }
  @include media-breakpoint-up(sm) {
    padding: 20px 20px 39px;
    max-width: 480px;
    // height: 380px;
    margin-right: 30px;

    &:last-child {
      margin-right: 0;
    }
  }
  font-family: 'PingFang TC';
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;

  &__title {
    font-size: 26px;
    color: #4a4a4a;
    margin-bottom: 14px;
    @include media-breakpoint-up(sm) {
      font-size: 32px;
      margin-bottom: 17px;
    }
  }

  &__devider {
    margin-bottom: 22px;
    width: 100%;
    border-bottom: solid 1px #0000001a;
    @include media-breakpoint-up(sm) {
      margin-bottom: 18px;
    }
  }

  &__detail {
    margin-bottom: 20px;
    font-size: 18px;
    color: #4a4a4a;
    @include media-breakpoint-up(sm) {
      font-size: 26px;
      margin-bottom: 32px;
    }
  }

  &__original_price {
    font-size: 18px;
    margin: 4px;
    color: #9b9b9b;
    text-decoration: line-through;
    @include media-breakpoint-up(sm) {
      font-size: 26px;
      margin-bottom: 6px;
    }
  }
  &__new_price {
    margin-bottom: 17px;
    font-size: 24px;
    color: #e81831;
    @include media-breakpoint-up(sm) {
      font-size: 32px;
      margin-bottom: 26px;
    }
  }
}
</style>
