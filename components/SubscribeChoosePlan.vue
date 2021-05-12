<template>
  <div class="choose-plan">
    <div class="choose-plan__wrapper">
      <div class="choose-plan__plan_container">
        <SubscribeChoosePlanCard
          v-for="plan in planList"
          :key="plan.id"
          :title="plan.title"
          :detail="plan.detail"
          :originalPrice="plan.originalPrice"
          :newPrice="plan.newPrice"
        />
      </div>

      <div class="choose-plan__info">
        <ol>
          <li v-for="info in infoList" :key="info.id">
            {{}}
            <span>{{ info.text }}</span>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
import SubscribeChoosePlanCard from '~/components/SubscribeChoosePlanCard.vue'
export default {
  components: {
    SubscribeChoosePlanCard,
  },
  data() {
    return {
      planList: [
        {
          id: 0,
          title: '一年方案',
          detail: '訂購一年鏡週刊52期，加購5期',
          originalPrice: 3990,
          newPrice: 2880,
        },
        {
          id: 1,
          title: '二年方案',
          detail: '訂購二年鏡週刊104期，加購10期',
          originalPrice: 7800,
          newPrice: 5280,
        },
      ],
      infoList: [
        {
          id: 0,
          text: '完成訂購後約三週內可分別收到第一期雜誌。',
        },
        {
          id: 0,
          text: '發票將於您完成訂購後七個工作天內寄達。',
        },
        {
          id: 0,
          text: '如需更改收件地址，請於服務時間來電告知。',
        },
        {
          id: 0,
          text: '雜誌如有下列情事者，同意訂戶退貨：',
          child: [
            '雜誌如有下列情事者，同意訂戶退貨：',
            '(1) 訂戶需支付作業手續費用。',
            '(2) 贈送的期數將不列入計算。',
          ],
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.choose-plan {
  background: white;
  padding: 49px 0 47px;

  &__wrapper {
    max-width: 990px;
    margin: auto;
  }

  &__plan_container {
    display: flex;
    justify-content: space-between;
  }
}
</style>
