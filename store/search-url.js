export const state = () => ({
  searchUrl: '',
})

export const mutations = {
  SET_SEARCH_URL(state, searchUrl) {
    state.searchUrl = searchUrl
  },
}

export const getters = {
  getSearchUrl: ({ searchUrl }) => searchUrl,
}
