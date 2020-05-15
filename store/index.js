import { camelizeKeys } from 'humps'

export const actions = {
  nuxtServerInit({ dispatch }) {
    dispatch('fetchGlobalData')
  },
  async fetchGlobalData({ commit, dispatch }) {
    const sectionsResult = await dispatch('sections/fetchSectionsData')

    commit(
      'sections/setSectionsData',
      camelizeKeys(sectionsResult.data).endpoints?.sections ?? {}
    )
  },
}
