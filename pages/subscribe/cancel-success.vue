<template>
  <div class="cancel-success">
    <SubscribeCancel
      :isAsk="false"
      title="成功取消訂閱"
      description="您已取消訂閱<span class='cancel-success__description_blue'>鏡週刊 Premium 服務-年訂閱方案</span>。取消將在本次收費週期 2021/6/30 結束時生效。"
      @back="handleBack"
    />
  </div>
</template>

<script>
import SubscribeCancel from '~/components/SubscribeCancel.vue'

export default {
  components: { SubscribeCancel },
  methods: {
    handleBack() {
      window.location.assign('/subscribe/set')
    },
  },
}
</script>

<style lang="scss" scoped>
.cancel-success {
  min-height: calc(100vw - 150px);
  padding: 40px 20px 0 20px;
  @include media-breakpoint-up(sm) {
    min-height: calc(100vw - 850px);
    padding: 80px;
  }
}
</style>

<style lang="scss">
.cancel-success__description_blue {
  color: #054f77;
}
</style>
