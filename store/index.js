export const state = () => ({
  canAdvertise: true,
})

export const mutations = {
  setCanAdvertise(state, canAdvertise) {
    state.canAdvertise = canAdvertise
  },
}

export const actions = {
  async nuxtServerInit({ commit, dispatch }) {
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
}
