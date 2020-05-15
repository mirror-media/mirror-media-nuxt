export const state = () => ({
  data: {},
})

export const mutations = {
  setSectionsData(state, data) {
    state.data = data
  },
}

export const actions = {
  fetchSectionsData() {
    return this.$axios.get('https://api.mirrormedia.mg/combo?endpoint=sections')
  },
}
