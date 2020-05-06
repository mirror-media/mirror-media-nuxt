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
    expect(wrapper.find(`.section--${sectionDisplayed.name}`).exists()).toBe(
      true
    )
    const link = wrapper.find(`[to="/section/${sectionDisplayed.name}"]`)
    expect(link.find('h2').text()).toBe(sectionDisplayed.title)

    expect(wrapper.find(`.section--${sectionNotDisplayed.name}`).exists()).toBe(
      false
    )
  })

  test('render the proper dropdown category link', () => {
    const [category] = sectionDisplayed.categories
    expect(
      wrapper
        .find(`.section--${sectionDisplayed.name} .section__dropdown`)
        .exists()
    ).toBe(true)
    const link = wrapper.find(`[to="/category/${category.name}"]`)
    expect(link.find('h3').text()).toBe(category.title)
  })
})

describe('home section nav', () => {
  const wrapper = shallowMount(UIHeaderNavSection, {
    propsData: {
      sections: [],
      partners: [],
    },
    stubs: ['nuxt-link'],
  })

  test('render the proper link', () => {
    const link = wrapper.find('[to="/"]')
    expect(link.find('h2').text()).toBe('首頁')
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

  test('render the proper external title', () => {
    expect(wrapper.find('.section--external h2').text()).toBe('健康醫療')
  })

  test('render the proper dropdown partner link', () => {
    const link = wrapper.find(`[to="/externals/${partnerDisplayed.name}"]`)
    expect(link.find('h3').text()).toBe(partnerDisplayed.display)

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
