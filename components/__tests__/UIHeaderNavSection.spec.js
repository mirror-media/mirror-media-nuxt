import UIHeaderNavSection from '../UIHeaderNavSection.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const mockSection = {
  name: 'culture',
  title: '文化',
  isFeatured: true,
  categories: [{ name: 'bookreview', title: '書評' }],
}
const mockPartner = {
  name: 'healthnews',
  display: '健康醫療網新聞',
  public: true,
}
const createWrapper = createWrapperHelper({
  propsData: {
    sections: [mockSection],
    partners: [mockPartner],
  },
  stubs: ['nuxt-link'],
})

describe('normal section nav', () => {
  test('render the proper section link', () => {
    const wrapper = createWrapper(UIHeaderNavSection)

    const link = wrapper.get(`[to="/section/${mockSection.name}"]`)
    expect(link.text()).toBe(mockSection.title)
  })

  test('render the proper category link', () => {
    const wrapper = createWrapper(UIHeaderNavSection)

    const [category] = mockSection.categories
    const link = wrapper.get(`[to="/category/${category.name}"]`)
    expect(link.text()).toBe(category.title)
  })

  test('active the section if its name matches currentSectionName', () => {
    const wrapper = createWrapper(UIHeaderNavSection, {
      propsData: {
        currentSectionName: 'culture',
      },
    })

    const link = wrapper.get(`.section--${mockSection.name}`)
    expect(link.classes('active')).toBe(true)
  })
})

describe('external section nav', () => {
  test('render the proper partner link', () => {
    const wrapper = createWrapper(UIHeaderNavSection)

    const link = wrapper.get(`[to="/externals/${mockPartner.name}"]`)
    expect(link.text()).toBe(mockPartner.display)
  })
})

describe('emitGA method', () => {
  test('with a proper argument when users click a section link', () => {
    const wrapper = createWrapper(UIHeaderNavSection)

    const linkNormal = wrapper.get(`[to="/section/${mockSection.name}"]`)
    linkNormal.trigger('click')
    expect(wrapper.emitted().sendGA[0]).toEqual([
      {
        eventCategory: 'header',
        eventAction: 'click',
        eventLabel: `section ${mockSection.name}`,
      },
    ])

    const linkHome = wrapper.get(`[to="/"]`)
    linkHome.trigger('click')
    expect(wrapper.emitted().sendGA[1]).toEqual([
      {
        eventCategory: 'header',
        eventAction: 'click',
        eventLabel: 'section home',
      },
    ])
  })

  test('with a proper argument when users click a category link', () => {
    const wrapper = createWrapper(UIHeaderNavSection)

    const [category] = mockSection.categories
    const link = wrapper.get(`[to="/category/${category.name}"]`)
    link.trigger('click')
    expect(wrapper.emitted().sendGA[0]).toEqual([
      {
        eventCategory: 'header',
        eventAction: 'click',
        eventLabel: `category ${category.name}`,
      },
    ])
  })

  test('with a proper argument when users click a partner link', () => {
    const wrapper = createWrapper(UIHeaderNavSection)

    const link = wrapper.get(`[to="/externals/${mockPartner.name}"]`)
    link.trigger('click')
    expect(wrapper.emitted().sendGA[0]).toEqual([
      {
        eventCategory: 'header',
        eventAction: 'click',
        eventLabel: `external ${mockPartner.name}`,
      },
    ])
  })
})

describe('markup', () => {
  test('render correctly', () => {
    const wrapper = createWrapper(UIHeaderNavSection)

    expect(wrapper.element).toMatchSnapshot()
  })
})
