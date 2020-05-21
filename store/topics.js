export const state = () => ({
  data: {},
})

export const getters = {
  topics(state) {
    return state.data.items ?? []
  },
}

export const mutations = {
  setTopicsData(state, data) {
    state.data = data
  },
}

export const actions = {
  async fetchTopicsData() {
    const response = await this.$fetchCombo({ endpoint: 'topics' })
    return response
  },
}
