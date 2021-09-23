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
      let error

      if (
        e.message === 'GraphQL error: You do not have access to this resource'
      ) {
        // custom Error to notify what happended exactly
        error = new Error(
          "GraphQL error: Can't find data in Israfel, please check if this member's data existed in Israfel"
        )
        throw error || e
      }
    }
  },
}
