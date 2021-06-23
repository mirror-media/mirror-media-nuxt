const state = () => ({
  readyToPay: false,
  resultStatus: 'success',
  orderInfo: {
    merchant_id: 'MS315799494',
    item_desc: '一年鏡週刊52期，加購5期方案',
    amount: 1,
    price: 2880,
    discount_code: '',
    pur_name: 'Liyi',
    pur_cell: '0975679310',
    pur_phone: '4980000 03',
    pur_addr: '中壢市中正路一段一號',
    pur_mail: 'liyibass@gmail.com',
    rec_name: 'Liyi',
    rec_cell: '0975679310',
    rec_phone: '4980000 03',
    rec_addr: '中壢市中正路一段一號',
    rec_remark: '',
    delivery: '限時專送',
    prime_token: '',
    price_total: 2880,
    carrier_type: 2,
    carrier_number: '',
    carrier_title: '',
    carrier_ubn: '',
  },
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
  setResultStatus(state, newResultStatus) {
    state.resultStatus = newResultStatus
  },
}

export { state, actions, getters, mutations }
