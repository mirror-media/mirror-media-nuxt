export const state = () => ({
  data: {},
  isWarmlifeFeatureToggleOn: false,
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
  setIsWarmlifeFeaturToggleOn(state, isWarmlifeFeatureToggleOn) {
    state.isWarmlifeFeatureToggleOn = isWarmlifeFeatureToggleOn
  },
}

export const actions = {
  async fetchPartnersData({ commit }) {
    const featureToggle = this.app.$config.warmlifeFeatureToggle
    const response =
      (await this.$fetchPartners({ maxResults: 25, page: 1 })) || {}

    commit('setPartnersData', response)
    commit('setIsWarmlifeFeaturToggleOn', featureToggle)
  },
}
