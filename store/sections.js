export const state = () => ({
  data: {},
})

export const getters = {
  displayedSections(state) {
    return state.data.items?.filter((section) => section.isFeatured) ?? []
  },
}

export const mutations = {
  setSectionsData(state, data) {
    state.data = data
  },
}

export const actions = {
  async fetchSectionsData() {
    const response = await this.$fetchCombo({ endpoint: 'sections' })
    return response
  },
}
