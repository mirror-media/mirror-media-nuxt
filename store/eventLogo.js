export const state = () => ({
  data: {},
})

export const getters = {
  eventLogoItem(state) {
    return state.data.items?.[0] ?? {}
  },
}

export const mutations = {
  setEventLogoData(state, data) {
    state.data = data
  },
}

export const actions = {
  async fetchEventLogoData() {
    const response = await this.$fetchEvent({
      isFeatured: true,
      eventType: 'logo',
      maxResults: 1,
    })
    return response
  },
}
