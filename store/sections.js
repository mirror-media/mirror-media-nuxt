export const state = () => ({
  data: {},
})

export const getters = {
  sections(state) {
    return state.data.items ?? []
  },
  displayedSections(state, getters) {
    return (
      getters.sections
        .filter(getIsFeaturedSection)
        .map(filterOutIsMemberOnlyCategoriesInNormalSection) ?? []
    )

    function filterOutIsMemberOnlyCategoriesInNormalSection(section) {
      return {
        ...section,
        categories:
          section.name === 'member'
            ? section.categories
            : section.categories.filter((category) => !category.isMemberOnly),
      }
    }

    function getIsFeaturedSection(section) {
      return section.isFeatured
    }
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
          title: '動態雜誌',
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
