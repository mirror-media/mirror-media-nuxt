<template>
  <div>
    <SubscribeStepProgress :currentStep="1" />

    <UiSubscribeInfo type="membership" :infoList="infoList" />
  </div>
</template>

<script>
import SubscribeStepProgress from '~/components/SubscribeStepProgress.vue'
import UiSubscribeInfo from '~/components/UiSubscribeInfo.vue'

export default {
  components: {
    SubscribeStepProgress,
    UiSubscribeInfo,
  },
  data() {
    return {
      infoList: [
        {
          id: 0,
          text: '月方案計算天數為 30 日，年方案計算天數為 365 日。',
        },
        {
          id: 1,
          text:
            '月訂閱方案不適用消費者保護法第十九條第一項通訊交易七日解除權之規定，所以月費會員可取消繼續訂閱但無法申請當月退費。',
        },
        {
          id: 2,
          text:
            '訂閱相關問題請 email 至會員專屬客服信箱 <a href = "mailto: MM-onlineservice@mirrormedia.mg" class="membership-subscribe__blue">MM-onlineservice@mirrormedia.mg</a>，我們會盡快為您協助處理。',
        },
      ],
    }
  },
}
</script>

<style lang="scss">
.membership-subscribe__blue {
  color: #054f77;
}
</style>
