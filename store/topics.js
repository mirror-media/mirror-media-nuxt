export const state = () => ({
  data: {},
})

export const mutations = {
  setTopicsData(state, data) {
    state.data = data
  },
}

export const actions = {
  fetchTopicsData() {
    return this.$axios.get('https://api.mirrormedia.mg/combo?endpoint=topics')
  },
}
