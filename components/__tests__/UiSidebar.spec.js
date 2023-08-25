import UiSidebar from '../UiSidebar.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  propsData: {
    topics: [],
    sections: [],
    partners: [],
    subBrands: [],
    promotions: [],
    socialMedia: [],
  },
  stubs: ['nuxt-link'],
})

const mockTopic = {
  name: '人造地獄',
  id: '5d8c26c23c4cad5f87630d37',
}
const mockSection = {
  order: 3,
  type: 'section',
  slug: 'entertainment',
  name: '娛樂',
  categories: [
    {
      id: '24',
      slug: 'latestnews',
      name: '娛樂頭條',
      isMemberOnly: false,
      href: '/category/latestnews',
    },
    {
      id: '36',
      slug: 'insight',
      name: '娛樂透視',
      isMemberOnly: false,
      href: '/category/insight',
    },
    {
      id: '48',
      slug: 'comic',
      name: '動漫遊戲',
      isMemberOnly: false,
      href: '/category/comic',
    },
    {
      id: '61',
      slug: 'rookie',
      name: '試鏡間',
      isMemberOnly: false,
      href: '/category/rookie',
    },
    {
      id: '62',
      slug: 'fashion',
      name: '穿衣鏡',
      isMemberOnly: false,
      href: '/category/fashion',
    },
    {
      id: '63',
      slug: 'madam',
      name: '蘭蘭夫人',
      isMemberOnly: false,
      href: '/category/madam',
    },
    {
      id: '64',
      slug: 'superstar',
      name: '我眼中的大明星',
      isMemberOnly: false,
      href: '/category/superstar',
    },
  ],
  href: '/section/entertainment',
}

/*
 * const mockPartner = {
 *   name: 'healthnews',
 *   display: '健康醫療網新聞',
 *   public: true,
 * }
 */
const mockSubBrand = {
  name: 'mirrorvoice',
  title: '鏡好聽',
  href: 'https://voice.mirrorfiction.com/',
}
const mockPromotion = {
  name: 'subscribe',
  title: '訂閱鏡週刊',
  href: 'https://docs.google.com/forms/d/1es1wqWfhwJn2sxDLc-6NRVokGn_fU0_M2YffhKMlcyM/viewform',
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

    const link = wrapper.get(`[href="${mockSection.href}"]`)
    expect(link.text()).toBe(mockSection.name)
  })

  test('render the proper category link', () => {
    const wrapper = createWrapper(UiSidebar, {
      propsData: {
        sections: [mockSection],
      },
    })

    const [mockCategory] = mockSection.categories
    const link = wrapper.get(`[href="${mockCategory.href}"]`)
    expect(link.text()).toBe(mockCategory.name)
  })

  test('close the categories if the section.categories has no data', () => {
    const wrapper = createWrapper(UiSidebar, {
      propsData: {
        sections: [{ categories: [] }],
      },
    })

    expect(wrapper.find('.section__categories').exists()).toBe(false)
  })

  /*
   * test('render the proper partner link', () => {
   *   const wrapper = createWrapper(UiSidebar, {
   *     propsData: {
   *       partners: [mockPartner],
   *     },
   *   })
   *
   *   const link = wrapper.get(`[href="/externals/${mockPartner.name}"]`)
   *   expect(link.text()).toBe(mockPartner.display)
   * })
   */

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

describe('promotions', () => {
  test('render the proper promotion link', () => {
    const wrapper = createWrapper(UiSidebar, {
      propsData: {
        promotions: [mockPromotion],
      },
    })

    expect(wrapper.get(`[href="${mockPromotion.href}"]`).text()).toBe(
      mockPromotion.title
    )
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

    const sectionLink = wrapper.get(`[href="${mockSection.href}"]`)
    sectionLink.trigger('click')
    expect(wrapper.emitted().sendGa[0]).toEqual([
      {
        eventCategory: 'sidebar',
        eventAction: 'click',
        eventLabel: `section ${mockSection.slug}`,
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
    const categoryLink = wrapper.get(`[href="${mockCategory.href}"]`)
    categoryLink.trigger('click')
    expect(wrapper.emitted().sendGa[0]).toEqual([
      {
        eventCategory: 'sidebar',
        eventAction: 'click',
        eventLabel: `category ${mockCategory.slug}`,
      },
    ])
  })

  /*
   * test('with a proper argument when users click a partner link', () => {
   *   const wrapper = createWrapper(UiSidebar, {
   *     propsData: {
   *       partners: [mockPartner],
   *     },
   *   })
   *
   *   const partnerLink = wrapper.get(`[href="/externals/${mockPartner.name}"]`)
   *   partnerLink.trigger('click')
   *   expect(wrapper.emitted().sendGa[0]).toEqual([
   *     {
   *       eventCategory: 'sidebar',
   *       eventAction: 'click',
   *       eventLabel: `external ${mockPartner.name}`,
   *     },
   *   ])
   * })
   */

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

  test('with a proper argument when users click a promotion link', () => {
    const wrapper = createWrapper(UiSidebar, {
      propsData: {
        promotions: [mockPromotion],
      },
    })

    wrapper.get(`[href="${mockPromotion.href}"]`).trigger('click')

    expect(wrapper.emitted().sendGa[0]).toEqual([
      {
        eventCategory: 'sidebar',
        eventAction: 'click',
        eventLabel: `more ${mockPromotion.name}`,
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
