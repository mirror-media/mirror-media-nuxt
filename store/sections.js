export const state = () => ({
  data: {},
})

export const getters = {
  sections(state) {
    return state.data.items ?? []
  },
  displayedSections(state, getters) {
    return getters.sections.filter((section) => section.isFeatured) ?? []
  },
  gainSectionByCategoryName: (state, getters) => (categoryName) => {
    return (
      getters.sections.find(function findCategory(section) {
        return section.categories.find(function doesNameMatch(category) {
          return categoryName === category.name
        })
      }) ?? {}
    )
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
