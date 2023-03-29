export const state = () => ({
  data: {},
  isWarnlifeFeatureToggleOn: false,
})

export const getters = {
  displayedPartners(state) {
    if (state.isWarnlifeFeatureToggleOn) {
      return state.data.items
    }
    return state.data.items?.filter((partner) => partner.public) ?? []
  },
}

export const mutations = {
  setPartnersData(state, data) {
    state.data = data
  },
  setIsWarnlifeFeaturToggleOn(state, isWarnlifeFeatureToggleOn) {
    state.isWarnlifeFeatureToggleOn = isWarnlifeFeatureToggleOn
  },
}

export const actions = {
  async fetchPartnersData({ commit }) {
    const featureToggle = this.app.$config.warmlifeFeatureToggle
    const response =
      (await this.$fetchPartners({ maxResults: 25, page: 1 })) || {}

    commit('setPartnersData', response)
    commit('setIsWarnlifeFeaturToggleOn', featureToggle)
  },
}
