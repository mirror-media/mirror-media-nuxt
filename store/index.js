import { fetchMemberBasicInfo } from '~/apollo/queries/memberSubscription.gql'

export const state = () => ({
  canAdvertise: true,
})

export const mutations = {
  setCanAdvertise(state, canAdvertise) {
    state.canAdvertise = canAdvertise
  },
}

export const actions = {
  async nuxtServerInit({ commit, dispatch, state }, { res, app }) {
    if (res && res.locals && res.locals.user) {
      const { allClaims: claims, idToken: token, ...authUser } = res.locals.user
      commit('membership/ON_AUTH_STATE_CHANGED_MUTATION', {
        authUser,
        claims,
        token,
      })

      const {
        data,
      } = await app.apolloProvider.clients.memberSubscription.query({
        query: fetchMemberBasicInfo,
        variables: {
          firebaseId: state.membership.userUid,
        },
      })
      commit('membership-subscribe/SET_BASIC_INFO', data.member)
    }

    const sectionsResponse = await dispatch('fetchGlobalData')
    commitSectionsData(commit, sectionsResponse)
  },

  async fetchGlobalData({ dispatch }) {
    return await Promise.allSettled([
      dispatch('sections/fetchSectionsData'),
      dispatch('sections-member/fetchData'),
    ])
  },
}

function commitSectionsData(
  commit,
  [responseSectionsData = {}, responseSectionsDataMember = []] = []
) {
  commit(
    'sections/setSectionsData',
    responseSectionsData?.value?.endpoints?.sections ?? {}
  )
  commit('sections/addMagazineToMemberSection')

  commit('sections-member/setData', responseSectionsDataMember?.value ?? [])
}
