import Vue from 'vue'

export const state = () => ({
  basicInfo: {},
})

export const mutations = {
  SET_BASIC_INFO(state, value = {}) {
    const basicInfo = Object.assign({}, state.basicInfo, value)
    Vue.set(state, 'basicInfo', basicInfo)
  },
  SET_IS_EMAIL_VERIFIED(state, value) {
    Vue.set(state, 'isEmailVerified', value)
  },
}
