export const state = () => ({
  data: [],
})

export const mutations = {
  setData(state, data) {
    state.data = data
  },
}

export const actions = {
  async fetchData() {
    return await this.$fetchMemberSections()
  },
}

export const getters = {
  categories(state) {
    return state.data
      .map(function getCategoriesOfSection(section) {
        return section.categories
      })
      .flat()
  },
}
