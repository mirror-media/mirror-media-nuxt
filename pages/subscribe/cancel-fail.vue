<template>
  <div class="cancel-success">
    <SubscribeCancel
      :isAsk="false"
      title="取消訂閱失敗"
      description="請重新操作或聯繫客服由專人為您服務。</br>service@mirrormedia.mg</br>02-6633-3805"
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
