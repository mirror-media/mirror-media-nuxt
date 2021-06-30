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
  getSectionByCategoryName: (state, getters) => (categoryName) => {
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
  addMagazineToMemberSection(state) {
    state.data.items?.forEach((section) => {
      if (section.name === 'member') {
        section.categories?.unshift({
          id: '5a02e0e31a53670d7778b990',
          isCampaign: false,
          isFeatured: false,
          isMemberOnly: true,
          name: 'magazine',
          style: 'feature',
          title: '電子雜誌',
          css: '',
          javascript: '',
          ogDescription: '',
          ogTitle: '',
        })
      }
    })
  },
}

export const actions = {
  async fetchSectionsData() {
    const response = await this.$fetchCombo({ endpoint: 'sections' })
    return response
  },
}
