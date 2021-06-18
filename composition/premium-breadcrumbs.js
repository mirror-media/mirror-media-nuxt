import { useContext } from '@nuxtjs/composition-api'

export function usePremiumBreadcrumbs() {
  const { route, store } = useContext()

  if (route.value.name === 'premiumsection-name') {
    const currentSectionName = getRouteParamsName(route)
    const currentSectionData = store.state['sections-member'].data.find(
      findDataByName(currentSectionName)
    )
    const text = currentSectionData.title
    return [
      {
        text: '會員專區',
        link: '/section/new/member',
      },
      {
        text,
        link: route.value.path,
      },
    ]
  } else if (route.value.name === 'category-name') {
    const currentCategoryName = getRouteParamsName(route)
    const currentCategoryData = store.getters[
      'sections-member/categories'
    ].find(findDataByName(currentCategoryName))
    const textCategory = currentCategoryData.title
    const section = store.state['sections-member'].data.find(function TODO(
      section
    ) {
      return section.categories.some(findDataByName(currentCategoryName))
    })
    const textSection = section.title
    const linkSection = `/premiumsection/${section.name}`
    return [
      {
        text: '會員專區',
        link: '/section/new/member',
      },
      {
        text: textSection,
        link: linkSection,
      },
      {
        text: textCategory,
        link: route.value.path,
      },
    ]
  }
}

function getRouteParamsName(route) {
  return route.value.params.name
}

function findDataByName(name) {
  return function (data) {
    return data.name === name
  }
}
