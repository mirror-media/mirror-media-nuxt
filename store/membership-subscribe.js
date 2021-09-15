import Vue from 'vue'
import { fetchMemberBasicInfo } from '~/apollo/queries/memberSubscriptionQuery.gql'

export const state = () => ({
  basicInfo: {},
})

export const mutations = {
  SET_BASIC_INFO(state, value = {}) {
    Vue.set(state, 'basicInfo', value)
  },
}

export const actions = {
  async FETCH_BASIC_INFO({ rootState, commit }) {
    if (rootState.membership.userUid) {
      try {
        const {
          data,
        } = await this.app.apolloProvider.clients.memberSubscription.query({
          fetchPolicy: 'no-cache',
          query: fetchMemberBasicInfo,
          variables: {
            firebaseId: rootState.membership.userUid,
          },
        })
        commit('SET_BASIC_INFO', data.member)
      } catch (e) {
        console.error(e)

        // throw e
      }
    }
  },
}
