<template>
  <div class="subscribe-magazine-page">
    <template v-if="isSuccess">
      <SubscribeStepProgress :currentStep="3" />
      <SubscribeSuccess
        :orderInfo="orderInfo"
        :orderInfoPurchasedList="orderInfoPurchasedList"
        :customerInfo="customerInfo"
      />
    </template>
    <template v-else>
      <SubscribeStepProgress :currentStep="2" />
      <SubscribeFail :resultStatus="resultStatus" :orderId="orderId" />
    </template>
  </div>
</template>

<script>
import qs from 'qs'
import SubscribeStepProgress from '~/components/SubscribeStepProgress.vue'
import SubscribeFail from '~/components/SubscribeFail.vue'
import SubscribeSuccess from '~/components/SubscribeSuccess.vue'
export default {
  layout: 'empty',
  asyncData({ req }) {
    if (req.method === 'POST') {
      let body = ''
      let temp = ''
      while ((temp = req.read())) {
        body += temp
      }
      const infoData = qs.parse(body)
      return {
        req: infoData,
        isSuccess: infoData.Status === 'SUCCESS',
        orderId: infoData.orderNumber,
      }
    }
  },
  components: {
    SubscribeStepProgress,
    SubscribeFail,
    SubscribeSuccess,
  },
  provide: {
    subscribeFailButtonLink: '/papermag',
  },
  data() {
    return {
      req: {},
      isSuccess: false,
      orderId: '',
      orderInfo: {},
      orderInfoPurchasedList: [],
      customerInfo: {},
    }
  },
  computed: {},
  async mounted() {
    if (this.isSuccess) {
      const decryptInfoData = await this.$axios.$post(
        `${window.location.origin}/api/v2/papermag/decrypt/v1`,
        this.req
      )
      console.log(decryptInfoData)
      this.orderInfo = {
        orderId: decryptInfoData.orderNumber,
        date: new Date(decryptInfoData.createdAt).format('yyyy-MM-dd'),
        discountPrice: true,
        discount_code: '123333',
      }
      this.orderInfoPurchasedList = [
        {
          text: decryptInfoData.merchandise.name,
          price: decryptInfoData.itemCount * decryptInfoData.merchandise.price,
        },
        { text: '運費', price: 0 },
        { text: '付款金額', price: decryptInfoData.totalAmount },
      ]
      this.customerInfo = {
        pur_name: decryptInfoData.purchaseName,
        pur_mail: decryptInfoData.purchaseEmail,
        pur_cell: decryptInfoData.purchaseMobile,
        rec_name: decryptInfoData.receiveName,
        rec_cell: decryptInfoData.receiveMobile,
        rec_addr: decryptInfoData.receiveAddress,
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.return {
  cursor: pointer;
}
</style>
