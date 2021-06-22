const state = () => ({
  readyToPay: false,
  orderInfo: {},
  paymentPayload: {
    MerchantID: '',
    TradeInfo: '',
    TradeSHA: '',
    Version: '',
  },
})

const getters = {
  isReadyToPay(state) {
    return state.readyToPay
  },
  getOrderInfo(state) {
    return state.orderInfo
  },
  getPaymentPayload(state) {
    return state.paymentPayload
  },
}

const actions = {
  updateReadyToPay({ commit }, isReady) {
    commit('setReadyToPay', isReady)
  },
  updateOrderInfo({ commit }, newOrderInfo) {
    commit('setOrderInfo', newOrderInfo)
  },

  updatePaymentPayload({ commit }, newPaymentPayload) {
    commit('setPaymentPayload', newPaymentPayload)
  },
}

const mutations = {
  setReadyToPay(state, isReady) {
    state.readyToPay = isReady
  },

  setOrderInfo(state, newOrderInfo) {
    state.orderInfo = newOrderInfo
  },
  setPaymentPayload(state, newPaymentPayload) {
    state.paymentPayload = newPaymentPayload
  },
}

export { state, actions, getters, mutations }
