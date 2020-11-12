import UiSidebar from '../UiSidebar.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  propsData: {
    topics: [],
    sections: [],
    partners: [],
    subBrands: [],
    others: [],
    socialMedia: [],
  },
  stubs: ['nuxt-link'],
})

const mockTopic = {
  name: '人造地獄',
  id: '5d8c26c23c4cad5f87630d37',
}
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
const mockSubBrand = {
  name: 'mirrorvoice',
  title: '鏡好聽',
  href: 'https://voice.mirrorfiction.com/',
}
const mockOther = {
  name: 'subscribe',
  title: '訂閱鏡週刊',
  href:
    'https://docs.google.com/forms/d/1es1wqWfhwJn2sxDLc-6NRVokGn_fU0_M2YffhKMlcyM/viewform',
}
const mockSocialMedia = {
  name: 'line',
  href: 'https://line.me/R/ti/p/%40cuk1273e',
}

describe('topics', () => {
  test('render the proper topic link', () => {
    const wrapper = createWrapper(UiSidebar, {
      propsData: {
        topics: [mockTopic],
      },
    })

    const link = wrapper.get(`[href="/topic/${mockTopic.id}"]`)
    expect(link.text()).toBe(mockTopic.name)
  })

  test('close the topics if the prop "topics" is an empty array', () => {
    const wrapper = createWrapper(UiSidebar, {
      propsData: {
        topics: [],
      },
    })

    expect(wrapper.find('.topics').exists()).toBe(false)
  })
})

describe('sections', () => {
  test('render the proper section link', () => {
    const wrapper = createWrapper(UiSidebar, {
      propsData: {
        sections: [mockSection],
      },
    })

    const link = wrapper.get(`[href="/section/${mockSection.name}"]`)
    expect(link.text()).toBe(mockSection.title)
  })

  test('render the proper category link', () => {
    const wrapper = createWrapper(UiSidebar, {
      propsData: {
        sections: [mockSection],
      },
    })

    const [mockCategory] = mockSection.categories
    const link = wrapper.get(`[href="/category/${mockCategory.name}"]`)
    expect(link.text()).toBe(mockCategory.title)
  })

  test('close the categories if the section.categories has no data', () => {
    const wrapper = createWrapper(UiSidebar, {
      propsData: {
        sections: [{ categories: [] }],
      },
    })

    expect(wrapper.find('.section__categories').exists()).toBe(false)
  })

  test('render the proper partner link', () => {
    const wrapper = createWrapper(UiSidebar, {
      propsData: {
        partners: [mockPartner],
      },
    })

    const link = wrapper.get(`[href="/externals/${mockPartner.name}"]`)
    expect(link.text()).toBe(mockPartner.display)
  })

  test('close the external section if the prop "partners" is an empty array', () => {
    const wrapper = createWrapper(UiSidebar, {
      propsData: {
        partners: [],
      },
    })

    expect(wrapper.find('.section--external').exists()).toBe(false)
  })

  test('render the proper sub-brand link', () => {
    const wrapper = createWrapper(UiSidebar, {
      propsData: {
        subBrands: [mockSubBrand],
      },
    })

    const link = wrapper.get(`[href="${mockSubBrand.href}"]`)
    expect(link.text()).toBe(mockSubBrand.title)
  })
})

describe('others', () => {
  test('render the proper other link', () => {
    const wrapper = createWrapper(UiSidebar, {
      propsData: {
        others: [mockOther],
      },
    })

    const link = wrapper.get(`[href="${mockOther.href}"]`)
    expect(link.text()).toBe(mockOther.title)
  })
})

describe('social media', () => {
  test('render the proper media link', () => {
    const wrapper = createWrapper(UiSidebar, {
      propsData: {
        socialMedia: [mockSocialMedia],
      },
    })

    expect(wrapper.find(`[href="${mockSocialMedia.href}"]`).exists()).toBe(true)
  })
})

describe('custom events', () => {
  test('emit close when users click the close icon', async () => {
    const wrapper = createWrapper(UiSidebar)

    const closeIcon = wrapper.get('.close-icon')
    await closeIcon.trigger('click')
    expect(wrapper.emitted().close).toBeTruthy()
  })
})

describe('emitGa method', () => {
  test('with a proper argument when users click a topic link', () => {
    const wrapper = createWrapper(UiSidebar, {
      propsData: {
        topics: [mockTopic],
      },
    })

    const topicLink = wrapper.get(`[href="/topic/${mockTopic.id}"]`)
    topicLink.trigger('click')
    expect(wrapper.emitted().sendGa[0]).toEqual([
      {
        eventCategory: 'sidebar',
        eventAction: 'click',
        eventLabel: `topic ${mockTopic.name}`,
      },
    ])

    const topicMoreLink = wrapper.get('[href="/section/topic"]')
    topicMoreLink.trigger('click')
    expect(wrapper.emitted().sendGa[1]).toEqual([
      {
        eventCategory: 'sidebar',
        eventAction: 'click',
        eventLabel: 'topic 更多',
      },
    ])
  })

  test('with a proper argument when users click a section link', () => {
    const wrapper = createWrapper(UiSidebar, {
      propsData: {
        sections: [mockSection],
      },
    })

    const sectionLink = wrapper.get(`[href="/section/${mockSection.name}"]`)
    sectionLink.trigger('click')
    expect(wrapper.emitted().sendGa[0]).toEqual([
      {
        eventCategory: 'sidebar',
        eventAction: 'click',
        eventLabel: `section ${mockSection.name}`,
      },
    ])
  })

  test('with a proper argument when users click a category link', () => {
    const wrapper = createWrapper(UiSidebar, {
      propsData: {
        sections: [mockSection],
      },
    })

    const [mockCategory] = mockSection.categories
    const categoryLink = wrapper.get(`[href="/category/${mockCategory.name}"]`)
    categoryLink.trigger('click')
    expect(wrapper.emitted().sendGa[0]).toEqual([
      {
        eventCategory: 'sidebar',
        eventAction: 'click',
        eventLabel: `category ${mockCategory.name}`,
      },
    ])
  })

  test('with a proper argument when users click a partner link', () => {
    const wrapper = createWrapper(UiSidebar, {
      propsData: {
        partners: [mockPartner],
      },
    })

    const partnerLink = wrapper.get(`[href="/externals/${mockPartner.name}"]`)
    partnerLink.trigger('click')
    expect(wrapper.emitted().sendGa[0]).toEqual([
      {
        eventCategory: 'sidebar',
        eventAction: 'click',
        eventLabel: `external ${mockPartner.name}`,
      },
    ])
  })

  test('with a proper argument when users click a sub-brand link', () => {
    const wrapper = createWrapper(UiSidebar, {
      propsData: {
        subBrands: [mockSubBrand],
      },
    })

    const subBrandLink = wrapper.get(`[href="${mockSubBrand.href}"]`)
    subBrandLink.trigger('click')
    expect(wrapper.emitted().sendGa[0]).toEqual([
      {
        eventCategory: 'sidebar',
        eventAction: 'click',
        eventLabel: `section ${mockSubBrand.name}`,
      },
    ])
  })

  test('with a proper argument when users click an other link', () => {
    const wrapper = createWrapper(UiSidebar, {
      propsData: {
        others: [mockOther],
      },
    })

    const otherLink = wrapper.get(`[href="${mockOther.href}"]`)
    otherLink.trigger('click')
    expect(wrapper.emitted().sendGa[0]).toEqual([
      {
        eventCategory: 'sidebar',
        eventAction: 'click',
        eventLabel: `more ${mockOther.name}`,
      },
    ])
  })

  test('with a proper argument when users click a social media link', () => {
    const wrapper = createWrapper(UiSidebar, {
      propsData: {
        socialMedia: [mockSocialMedia],
      },
    })

    const socialMediaLink = wrapper.get(`[href="${mockSocialMedia.href}"]`)
    socialMediaLink.trigger('click')
    expect(wrapper.emitted().sendGa[0]).toEqual([
      {
        eventCategory: 'sidebar',
        eventAction: 'click',
        eventLabel: `social ${mockSocialMedia.name}`,
      },
    ])
  })
})
