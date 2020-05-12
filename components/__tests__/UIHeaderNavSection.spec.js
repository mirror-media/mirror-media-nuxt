import { shallowMount } from '@vue/test-utils'
import UIHeaderNavSection from '../UIHeaderNavSection.vue'

const sectionDisplayed = {
  name: 'culture',
  title: '文化',
  isFeatured: true,
  categories: [{ name: 'bookreview', title: '書評' }],
}
const sectionNotDisplayed = {
  name: 'people',
  title: '人物',
  isFeatured: false,
  categories: [{ name: 'somebody', title: '一鏡到底' }],
}

const partnerDisplayed = {
  name: 'healthnews',
  display: '健康醫療網新聞',
  public: true,
}
const partnerNotDisplayed = {
  name: 'nctudodo',
  display: '交大喀報',
  public: false,
}

describe('normal section nav', () => {
  const wrapper = shallowMount(UIHeaderNavSection, {
    propsData: {
      sections: [sectionDisplayed, sectionNotDisplayed],
      partners: [],
    },
    stubs: ['nuxt-link'],
  })

  test('render the proper section link', () => {
    const link = wrapper.find(`[to="/section/${sectionDisplayed.name}"]`)
    expect(link.text()).toBe(sectionDisplayed.title)

    expect(
      wrapper.find(`[to="/section/${sectionNotDisplayed.name}"]`).exists()
    ).toBe(false)
  })

  test('render the proper category link', () => {
    const [category] = sectionDisplayed.categories
    const link = wrapper.find(`[to="/category/${category.name}"]`)
    expect(link.text()).toBe(category.title)
  })
})

describe('external section nav', () => {
  const wrapper = shallowMount(UIHeaderNavSection, {
    propsData: {
      sections: [],
      partners: [partnerDisplayed, partnerNotDisplayed],
    },
    stubs: ['nuxt-link'],
  })

  test('render the proper partner link', () => {
    const link = wrapper.find(`[to="/externals/${partnerDisplayed.name}"]`)
    expect(link.text()).toBe(partnerDisplayed.display)

    expect(
      wrapper.find(`[to="/externals/${partnerNotDisplayed.name}"]`).exists()
    ).toBe(false)
  })
})

describe('emitGA method', () => {
  const wrapper = shallowMount(UIHeaderNavSection, {
    propsData: {
      sections: [sectionDisplayed],
      partners: [partnerDisplayed],
    },
    stubs: ['nuxt-link'],
  })

  beforeEach(function resetEmitted() {
    wrapper._emitted.sendGA = []
  })

  test('with a proper argument when user clicks a section link', () => {
    const linkNormal = wrapper.find(`[to="/section/${sectionDisplayed.name}"]`)
    linkNormal.trigger('click')
    expect(wrapper.emitted().sendGA[0]).toEqual([
      {
        eventCategory: 'header',
        eventAction: 'click',
        eventLabel: `section ${sectionDisplayed.name}`,
      },
    ])

    const linkHome = wrapper.find(`[to="/"]`)
    linkHome.trigger('click')
    expect(wrapper.emitted().sendGA[1]).toEqual([
      {
        eventCategory: 'header',
        eventAction: 'click',
        eventLabel: 'section home',
      },
    ])
  })

  test('with a proper argument when user clicks a category link', () => {
    const [category] = sectionDisplayed.categories
    const link = wrapper.find(`[to="/category/${category.name}"]`)
    link.trigger('click')
    expect(wrapper.emitted().sendGA[0]).toEqual([
      {
        eventCategory: 'header',
        eventAction: 'click',
        eventLabel: `category ${category.name}`,
      },
    ])
  })

  test('with a proper argument when user clicks a partner link', () => {
    const link = wrapper.find(`[to="/externals/${partnerDisplayed.name}"]`)
    link.trigger('click')
    expect(wrapper.emitted().sendGA[0]).toEqual([
      {
        eventCategory: 'header',
        eventAction: 'click',
        eventLabel: `external ${partnerDisplayed.name}`,
      },
    ])
  })
})

describe('markup', () => {
  test('render correctly', () => {
    const wrapper = shallowMount(UIHeaderNavSection, {
      propsData: {
        sections: [sectionDisplayed],
        partners: [partnerDisplayed],
      },
      stubs: ['nuxt-link'],
    })

    expect(wrapper.element).toMatchSnapshot()
  })
})
