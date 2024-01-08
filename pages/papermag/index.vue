<template>
  <div class="subscribe-magazine-page">
    <SubscribeStepProgress :currentStep="1" />
    <div v-if="shouldShowNotice" class="notice__wrapper">
      <div class="notice">
        <h3>[2月份訂戶派送異動公告]</h3>
        <p>預祝新春如意！造成困擾敬請見諒。</p>
        <p>第384期(原2/7)提前於2/3(六)出刊，2/6(二)完成配送。</p>
        <p>第385期(原2/14)提前於2/7(三)出刊，因逢春節期間2/16(五)完成配送 。</p>
        <p>第387期(原2/28)延至2/29(四)起配送，3/1(五)完成配送。</p>
      </div>
    </div>
    <SubscribeChoosePlan :shouldShowNotice="shouldShowNotice" />
  </div>
</template>

<script>
import SubscribeStepProgress from '~/components/SubscribeStepProgress.vue'
import SubscribeChoosePlan from '~/components/SubscribeChoosePlan.vue'

export default {
  components: {
    SubscribeStepProgress,
    SubscribeChoosePlan,
  },
  computed: {
    shouldShowNotice() {
      const startUtc = new Date(Date.UTC(2024, 0, 23, 16))
      const endUtc = new Date(Date.UTC(2024, 1, 29, 16))
      const nowUtc = new Date(Date.now())

      // 2024/1/24 ~ 3/1
      return nowUtc > startUtc && nowUtc < endUtc
    },
  },
}
</script>

<style lang="scss" scoped>
/*  should remove these css style below after 2023 Dragon Boat Festival */
.notice__wrapper {
  padding: 16px 8px;
  @include media-breakpoint-up(xl) {
    padding: 24px 8px;
  }
}
.notice {
  width: 100%;
  max-width: 990px;
  background-color: rgba(229, 23, 49, 0.05);
  margin: 0 auto;
  padding: 16px 24px 16px 16px;
  @include media-breakpoint-up(xl) {
    margin: 0 auto;
    padding: 24px 48px;
  }
  h3 {
    font-weight: 400;
    width: 100%;
    font-size: 22px;
    color: #e51731;
    line-height: 1.4;
    margin-bottom: 16px;
    @include media-breakpoint-up(xl) {
      font-size: 24px;
    }
  }
  p {
    font-weight: 400;
    width: 100%;
    color: rgba(0, 0, 0, 0.66);
    font-size: 16px;
    line-height: 1.5;
    @include media-breakpoint-up(xl) {
      font-size: 18px;
    }
  }
}
/*  should remove these css style above after 2023 Dragon Boat Festival --> */
.subscribe-magazine-page {
  position: relative;
}
</style>
