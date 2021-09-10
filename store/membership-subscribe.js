import Vue from 'vue'
import { fetchMemberBasicInfo } from '~/apollo/queries/memberSubscription.gql'

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

export const actions = {
  async FETCH_BASIC_INFO({ rootState, commit }) {
    if (rootState.membership.userUid) {
      try {
        const {
          data,
        } = await this.app.apolloProvider.clients.memberSubscription.query({
          query: fetchMemberBasicInfo,
          variables: {
            firebaseId: rootState.membership.userUid,
          },
        })
        commit('SET_BASIC_INFO', data.member)
      } catch (e) {
        console.error(e)
      }
    }
  },
}
