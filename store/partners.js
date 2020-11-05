export const state = () => ({
  data: {},
})

export const getters = {
  displayedPartners(state) {
    return state.data.items?.filter((partner) => partner.public) ?? []
  },
}

export const mutations = {
  setPartnersData(state, data) {
    state.data = data
  },
}

export const actions = {
  async fetchPartnersData({ commit }) {
    const response =
      (await this.$fetchPartners({ maxResults: 25, page: 1 })) || {}

    commit('setPartnersData', response)
  },
}
