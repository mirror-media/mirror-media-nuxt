const state = () => ({
  readyToPay: false,
  resultStatus: 'pending',
  orderInfo: {},
  paymentPayload: {
    MerchantID: '',
    TradeInfo: '',
    TradeSHA: '',
    Version: '',
  },
  infoPayload: {
    JwtToken: '',
    MerchantOrderNo: '',
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
  getInfoPayload(state) {
    console.log(state)
    return state.infoPayload
  },
  getResultStatus(state) {
    return state.resultStatus
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

  updateInfoPayload({ commit }, newInfoPayload) {
    commit('setInfoPayload', newInfoPayload)
  },

  updateResultStatus({ commit }, newResultStatus) {
    commit('setResultStatus', newResultStatus)
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
  setInfoPayload(state, newInfoPayload) {
    state.infoPayload = newInfoPayload
  },
  setResultStatus(state, newResultStatus) {
    state.resultStatus = newResultStatus
  },
}

export { state, actions, getters, mutations }
