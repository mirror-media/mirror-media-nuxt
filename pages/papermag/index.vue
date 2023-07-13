<template>
  <div class="subscribe-magazine-page">
    <SubscribeStepProgress :currentStep="1" />
    <div v-if="shouldShowNotice" class="notice__wrapper">
      <div class="notice">
        <h3>2023期間限定</h3>
        <p>（1）「半年嘗鮮」28期 $1680</p>
        <p>（2）「365年度」52期 $2780</p>
        <p>（3）「團go」一次訂滿3份，52期∕$2580∕份</p>
      </div>
    </div>
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
    shouldShowNotice() {
      const nowUtc = new Date(Date.now())

      // now ~ 2023.9.30
      return nowUtc < new Date(Date.UTC(2023, 8, 29, 16))
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
