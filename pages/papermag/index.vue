<template>
  <div class="subscribe-magazine-page">
    <SubscribeStepProgress :currentStep="1" />
    <div v-if="shouldShowNotice" class="notice__wrapper">
      <div class="notice">
        <h3>[4月份訂戶派送異動公告]</h3>
        <p>預祝清明佳節愉快！</p>
        <p>
          因逢清明連續假期，392期(4/3出刊)的雜誌最晚4/8(一)完成配送，造成困擾敬請見諒。
        </p>
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
      const startUtc = new Date(Date.UTC(2024, 2, 19, 16))
      const endUtc = new Date(Date.UTC(2024, 3, 8, 16))
      const nowUtc = new Date(Date.now())

      // 2024/3/20 ~ 4/9
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
