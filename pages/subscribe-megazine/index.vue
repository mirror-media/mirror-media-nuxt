<template>
  <div class="subscribe-megazine-page">
    <SubscribeStepProgress :currentStep="currentStep" />

    <SubscribeChoosePlan v-if="currentStep === 1" :choosePlan="choosePlan" />

    <SubscribeForm
      v-if="currentStep === 2"
      :perchasedPlan="perchasedPlan"
      :discount="discount"
      :ordererData="ordererData"
      :receiverData="receiverData"
      :chooseShipPlan="chooseShipPlan"
    />
  </div>
</template>

<script>
import SubscribeStepProgress from '~/components/SubscribeStepProgress.vue'
import SubscribeChoosePlan from '~/components/SubscribeChoosePlan.vue'
import SubscribeForm from '~/components/SubscribeForm.vue'
export default {
  components: {
    SubscribeStepProgress,
    SubscribeChoosePlan,
    SubscribeForm,
  },
  data() {
    return {
      currentStep: 1,
      choosedPlanId: 0,

      perchasedPlan: [
        {
          id: 0,
          title: '一年方案',
          detail: '一年鏡週刊52期，加購5期方案',
          originalPrice: 3990,
          newPrice: 2880,
          count: 0,
        },
        {
          id: 1,
          title: '二年方案',
          detail: '二年鏡週刊104期，加購10期方案',
          originalPrice: 7800,
          newPrice: 5280,
          count: 0,
        },
      ],
      discount: {
        hasCode: false,
        code: '',
      },
      ordererData: {
        name: {
          title: '姓名',
          value: '',
        },
        cellphone: {
          title: '手機',
          value: '',
        },
        phone: {
          title: '市話（非必填）',
          value: '',
        },
        phoneExt: {
          title: '通訊地址',
          value: '',
        },
        address: {
          title: '地址',
          value: '',
        },
        email: {
          title: '電子信箱',
          value: '',
        },
      },
      receiverData: {
        name: {
          title: '姓名',
          value: '',
        },
        cellphone: {
          title: '手機',
          value: '',
        },
        phone: {
          title: '市話（非必填）',
          value: '',
        },
        phoneExt: {
          title: '通訊地址',
          value: '',
        },
        address: {
          title: '地址',
          value: '',
        },
        email: {
          title: '電子信箱',
          value: '',
        },
      },
      shipPlan: {
        name: '限時專送',
        cost: 0,
      },
    }
  },

  methods: {
    choosePlan(choosedPlanId) {
      this.perchasedPlan[choosedPlanId].count++
      this.currentStep++
    },
    chooseShipPlan(choosedShipPlan) {
      this.shipPlan = choosedShipPlan
    },
  },
}
</script>

<style lang="scss" scoped></style>
