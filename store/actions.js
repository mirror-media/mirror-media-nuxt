import { camelizeKeys } from 'humps'

export default {
  nuxtServerInit({ dispatch }) {
    dispatch('fetchGlobalData')
  },
  async fetchGlobalData({ commit, dispatch }) {
    const sectionsResult = await dispatch('fetchSectionsData')

    commit(
      'setSectionsData',
      camelizeKeys(sectionsResult.data).endpoints?.sections ?? {}
    )
  },
  fetchSectionsData() {
    return this.$axios.get('https://api.mirrormedia.mg/combo?endpoint=sections')
  },
  fetchTopicsData() {
    return this.$axios.get('https://api.mirrormedia.mg/combo?endpoint=topics')
  },
  fetchPartnersData() {
    return this.$axios.get(
      'https://api.mirrormedia.mg/partners?max_results=25&page=1'
    )
  },
}
