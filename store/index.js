export const actions = {
  nuxtServerInit({ dispatch }) {
    dispatch('fetchGlobalData')
  },

  async fetchGlobalData({ commit, dispatch }) {
    const sectionsResponse = await dispatch('sections/fetchSectionsData')

    commit(
      'sections/setSectionsData',
      sectionsResponse.endpoints.sections ?? {}
    )
  },
}
