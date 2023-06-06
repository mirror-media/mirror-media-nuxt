<template>
  <div class="subscribe-magazine-page">
    <SubscribeStepProgress :currentStep="1" />
    <!-- should remove this div below after 2023 Dragon Boat Festival -->
    <div v-if="shouldShowNotice" class="notice__wrapper">
      <div class="notice">
        <h3>訂戶派送公告</h3>
        <p>預祝端午佳節愉快！</p>
        <p>
          因逢端午連續假期，351期(6/21出刊)的雜誌最晚6/26(一)完成配送，造成困擾敬請見諒。
        </p>
      </div>
    </div>
    <!-- should remove this div above after 2023 Dragon Boat Festival -->
    <SubscribeChoosePlan />
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
    // should remove this div above after 2023 Dragon Boat Festival
    shouldShowNotice() {
      const nowUtc = new Date(Date.now())

      // 2023.6.7 ~ 28
      return (
        nowUtc < new Date(Date.UTC(2023, 5, 27, 16)) &&
        nowUtc > new Date(Date.UTC(2023, 5, 6, 16))
      )
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
