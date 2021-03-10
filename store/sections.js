import { SECTION_MEMBER_NAME } from '~/constants'

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
  sectionsMember(state, getters) {
    return getters.sections
      .filter(function filterByName(section) {
        return SECTION_MEMBER_NAME.includes(section?.name)
      })
      .map(function processCategories(section) {
        return {
          ...section,
          categories: (section?.categories ?? []).filter(
            function filterIsMemberOnly(category) {
              return category?.isMemberOnly
            }
          ),
        }
      })
      .concat([
        {
          id: 'mirrorcolumn',
          name: 'mirrorcolumn',
          customPath: 'category',
          title: '名家專欄',
          categories: [],
        },
      ])
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
}

export const actions = {
  async fetchSectionsData() {
    const response = await this.$fetchCombo({ endpoint: 'sections' })
    return response
  },
}
