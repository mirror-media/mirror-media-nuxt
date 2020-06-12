export const state = () => ({
  sectionName: undefined,
})

export const mutations = {
  setSectionName(state, name) {
    state.sectionName = name
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
