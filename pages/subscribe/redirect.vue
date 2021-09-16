<template>
  <div class="redirect-page">
    <NewebpayForm
      :merchantId="paymentPayload.MerchantID"
      :tradeInfo="paymentPayload.TradeInfo"
      :tradeSha="paymentPayload.TradeSha"
      :version="paymentPayload.Version"
    />
  </div>
</template>

<script>
import NewebpayForm from '~/components/NewebpayForm.vue'
import { useMemberSubscribeMachine } from '~/xstate/member-subscribe/compositions'
import { persistStorageState } from '~/xstate/member-subscribe/util'

export default {
  components: {
    NewebpayForm,
  },
  layout: 'empty',
  middleware({ store, redirect }) {
    // block access direct from url
    const isReadyToPay = store.getters['subscribe/isReadyToPay']
    if (!isReadyToPay) {
      // redirect('/papermag')
    }
  },
  setup() {
    const { state, send } = useMemberSubscribeMachine()
    return {
      stateMembershipSubscribe: state,
      sendMembershipSubscribe: send,
    }
  },
  computed: {
    paymentPayload() {
      const queryString = this.$route.query
      return {
        MerchantID: queryString.MerchantID,
        TradeInfo: queryString.TradeInfo,
        TradeSha: queryString.TradeSha,
        Version: parseFloat(queryString.Version),
      }
    },
  },
  mounted() {
    this.sendMembershipSubscribe('付款')
    persistStorageState(this.stateMembershipSubscribe)

    // submit newebpay form-post to redirect to newebpay page
    const formDOM = document.forms.newebpay
    formDOM.submit()
  },
  methods: {
    storeToSessionStorage(name, value) {
      if (process.browser) {
        sessionStorage.setItem(name, value)
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
