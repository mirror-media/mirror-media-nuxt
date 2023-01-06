<template>
  <div class="subscribe-magazine-page">
    <SubscribeStepProgress :currentStep="1" />
    <!-- should remove this div below after 2023 lunar year vacation -->
    <div class="notice__wrapper">
      <div class="notice">
        <h3>新春派發公告</h3>
        <p>預祝新春如意！</p>
        <p>
          因逢春節連假，330期將延後與331期一併於2/1陸續派送，造成困擾敬請見諒。
        </p>
      </div>
    </div>
    <!-- should remove this div above after 2023 lunar year vacation -->

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
}
</script>

<style lang="scss" scoped>
.subscribe-magazine-page {
  position: relative;
}
/*  should remove these css style below after 2023 lunar year vacation --> */

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
/*  should remove these css style above after 2023 lunar year vacation --> */
</style>
