import UISidebar from '../UISidebar.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  propsData: {
    topics: [],
    sections: [],
    partners: [],
    others: [],
    socialMedia: [],
  },
  stubs: ['nuxt-link'],
})

describe('topics', () => {
  const mockTopic = {
    name: '人造地獄',
    id: '5d8c26c23c4cad5f87630d37',
  }

  test('render the proper topic link', () => {
    const wrapper = createWrapper(UISidebar, {
      propsData: {
        topics: [mockTopic],
      },
    })

    const link = wrapper.get(`[to="/topic/${mockTopic.id}"]`)
    expect(link.text()).toBe(mockTopic.name)
  })
})

describe('sections', () => {
  const mockSection = {
    name: 'culture',
    title: '文化',
    isFeatured: true,
    categories: [{ name: 'bookreview', title: '書評' }],
  }

  test('render the proper section link', () => {
    const wrapper = createWrapper(UISidebar, {
      propsData: {
        sections: [mockSection],
      },
    })

    const link = wrapper.get(`[to="/section/${mockSection.name}"]`)
    expect(link.text()).toBe(mockSection.title)
  })

  test('render the proper category link', () => {
    const wrapper = createWrapper(UISidebar, {
      propsData: {
        sections: [mockSection],
      },
    })

    const [mockCategory] = mockSection.categories
    const link = wrapper.get(`[to="/category/${mockCategory.name}"]`)
    expect(link.text()).toBe(mockCategory.title)
  })

  const mockPartner = {
    name: 'healthnews',
    display: '健康醫療網新聞',
    public: true,
  }
  test('render the proper partner link', () => {
    const wrapper = createWrapper(UISidebar, {
      propsData: {
        partners: [mockPartner],
      },
    })

    const link = wrapper.get(`[to="/externals/${mockPartner.name}"]`)
    expect(link.text()).toBe(mockPartner.display)
  })
})

describe('others', () => {
  const mockOther = {
    name: 'subscribe',
    title: '訂閱鏡週刊',
    href:
      'https://docs.google.com/forms/d/1es1wqWfhwJn2sxDLc-6NRVokGn_fU0_M2YffhKMlcyM/viewform',
  }

  test('render the proper other link', () => {
    const wrapper = createWrapper(UISidebar, {
      propsData: {
        others: [mockOther],
      },
    })

    const link = wrapper.get(`[href="${mockOther.href}"]`)
    expect(link.text()).toBe(mockOther.title)
  })
})

describe('social media', () => {
  const mockMedia = {
    name: 'line',
    href: 'https://line.me/R/ti/p/%40cuk1273e',
  }

  test('render the proper media link', () => {
    const wrapper = createWrapper(UISidebar, {
      propsData: {
        socialMedia: [mockMedia],
      },
    })

    expect(wrapper.find(`[href="${mockMedia.href}"]`).exists()).toBe(true)
  })
})

describe('custom events', () => {
  test('emit close when users click the close icon', async () => {
    const wrapper = createWrapper(UISidebar)

    const closeIcon = wrapper.get('.close-icon')
    await closeIcon.trigger('click')
    expect(wrapper.emitted().close).toBeTruthy()
  })
})
