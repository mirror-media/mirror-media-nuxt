<template>
  <div class="cancel-ask">
    <SubscribeCancel
      :isAsk="true"
      title="取消訂閱"
      description="請問您為何想取消訂閱鏡週刊 Premium 服務？"
      @back="handleBack"
      @submit="handleSubmit"
    />
    <SubscribeCancel
      :isAsk="false"
      title="取消訂閱提示"
      description="由於您先前於 APP 購買，如要取消訂閱，請至 App Store (iOS 系統) 或 Google Play (Android 系統) 操作"
      @back="handleBack"
    />
  </div>
</template>

<script>
import SubscribeCancel from '~/components/SubscribeCancel.vue'

export default {
  components: { SubscribeCancel },
  data() {
    return {
      reason: [],
    }
  },
  methods: {
    handleBack() {
      window.location.assign('/subscribe/set')
    },
    handleSubmit(reason) {
      this.reason = reason
    },
  },
}
</script>

<style lang="scss" scoped>
.cancel-ask {
  min-height: calc(100vw - 150px);
  padding: 40px 20px 0 20px;
  @include media-breakpoint-up(sm) {
    min-height: calc(100vw - 850px);
    padding: 80px;
  }
}
</style>
