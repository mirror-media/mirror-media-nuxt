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
    const result = await this.app.apolloProvider.clients.memberSubscription.query(
      {
        fetchPolicy: 'no-cache',
        query: fetchMemberBasicInfo,
        variables: {
          firebaseId: rootState.membership.userUid,
        },
      }
    )

    /*
     * we use "allMembers" query to fetch member in israfel
     * if there's no result( which no error, allMembers.length = 0),
     * then return custom error message "Can't find data in Israfel"
     */
    if (result?.data?.allMembers?.length) {
      const memberInfoData = result?.data?.allMembers?.[0]
      commit('SET_BASIC_INFO', memberInfoData)
    } else {
      throw new Error(
        "GraphQL error: Can't find data in Israfel, please check if this member's data existed in Israfel"
      )
    }
  },
}
