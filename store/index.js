export const state = () => ({
  canAdvertise: true,
})

export const mutations = {
  setCanAdvertise(state, canAdvertise) {
    state.canAdvertise = canAdvertise
  },
}

export const actions = {
  async nuxtServerInit({ commit, dispatch }, { res }) {
    if (res && res.locals && res.locals.user) {
      const { allClaims: claims, idToken: token, ...authUser } = res.locals.user
      commit('membership/ON_AUTH_STATE_CHANGED_MUTATION', {
        authUser,
        claims,
        token,
      })
    }

    const [sectionsResponse] = await dispatch('fetchGlobalData')

    commitSectionsData(commit, sectionsResponse)
  },

  async fetchGlobalData({ dispatch }) {
    const sectionsResponse = await dispatch('sections/fetchSectionsData')
    return [sectionsResponse]
  },
}

function commitSectionsData(commit, response) {
  commit('sections/setSectionsData', response.endpoints.sections ?? {})
  commit('sections/addMagazineToMemberSection')
}
