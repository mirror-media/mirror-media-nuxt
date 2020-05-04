import { shallowMount } from '@vue/test-utils'
import UIHeaderNavSection from '../UIHeaderNavSection.vue'

describe('normal section nav', () => {
  const section1 = {
    name: 'culture',
    title: '文化',
    isFeatured: true,
    categories: [{ name: 'bookreview', title: '書評' }],
  }
  const section2 = {
    name: 'people',
    title: '人物',
    isFeatured: false,
    categories: [{ name: 'somebody', title: '一鏡到底' }],
  }
  const wrapper = shallowMount(UIHeaderNavSection, {
    propsData: {
      sections: [section1, section2],
      partners: [],
    },
    stubs: ['nuxt-link'],
  })

  test('render the proper section link', () => {
    expect(wrapper.find(`.section--${section1.name}`).exists()).toBe(true)
    const link = wrapper.find(`[to="/section/${section1.name}"]`)
    expect(link.find('h2').text()).toBe(section1.title)

    expect(wrapper.find(`.section--${section2.name}`).exists()).toBe(false)
  })

  test('render the proper dropdown category link', () => {
    const [category1] = section1.categories
    expect(
      wrapper.find(`.section--${section1.name} .section__dropdown`).exists()
    ).toBe(true)
    const link = wrapper.find(`[to^="/category/${category1.name}"]`)
    expect(link.find('h3').text()).toBe(category1.title)
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
  const partner1 = {
    name: 'healthnews',
    display: '健康醫療網新聞',
    public: true,
  }
  const partner2 = {
    name: 'nctudodo',
    display: '交大喀報',
    public: false,
  }
  const wrapper = shallowMount(UIHeaderNavSection, {
    propsData: {
      sections: [],
      partners: [partner1, partner2],
    },
    stubs: ['nuxt-link'],
  })

  test('render the proper external title', () => {
    expect(wrapper.find('.section--external h2').text()).toBe('健康醫療')
  })

  test('render the proper dropdown partner link', () => {
    const link = wrapper.find(`[to="/externals/${partner1.name}"]`)
    expect(link.find('h3').text()).toBe(partner1.display)

    expect(wrapper.find(`[to="/externals/${partner2.name}"]`).exists()).toBe(
      false
    )
  })
})
