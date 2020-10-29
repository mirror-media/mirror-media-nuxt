export const state = () => ({
  data: {},
})

export const getters = {
  displayedTopics(state) {
    return (
      state.data.items?.filter((topic) => topic.isFeatured).slice(0, 7) ?? []
    )
  },
}

export const mutations = {
  setTopicsData(state, data) {
    state.data = data
  },
}

export const actions = {
  async fetchTopicsData({ commit }) {
    const response = (await this.$fetchCombo({ endpoint: 'topics' })) || {}

    commit('setTopicsData', response.endpoints?.topics || {})
  },
}
