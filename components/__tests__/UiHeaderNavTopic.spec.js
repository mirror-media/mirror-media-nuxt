import UiHeaderNavTopic from '../UiHeaderNavTopic.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  propsData: {
    topics: [],
    subBrands: [],
  },
  stubs: ['nuxt-link'],
})

const mockTopic = {
  name: '人造地獄',
  id: '5d8c26c23c4cad5f87630d37',
}
const mockSubBrand = {
  name: 'mirrorvoice',
  title: '鏡好聽',
  href: 'https://voice.mirrorfiction.com/',
}

describe('topic nav', () => {
  test('render the proper topic link', () => {
    const wrapper = createWrapper(UiHeaderNavTopic, {
      propsData: {
        topics: [mockTopic],
        subBrands: [],
      },
    })

    const linkNormal = wrapper.get(`[href="/topic/${mockTopic.id}"]`)
    expect(linkNormal.text()).toBe(mockTopic.name)
  })
})

describe('sub-brand nav', () => {
  test('render the proper sub-brand link', () => {
    const wrapper = createWrapper(UiHeaderNavTopic, {
      propsData: {
        subBrands: [mockSubBrand],
      },
    })

    const subBrandLink = wrapper.get(`[href="${mockSubBrand.href}"]`)
    expect(subBrandLink.get('img').attributes().alt).toBe(mockSubBrand.title)
  })
})

describe('emitGA method', () => {
  test('with a proper argument when users click a topic link', () => {
    const wrapper = createWrapper(UiHeaderNavTopic, {
      propsData: {
        topics: [mockTopic],
        subBrands: [],
      },
    })

    const linkNormal = wrapper.get(`[href="/topic/${mockTopic.id}"]`)
    linkNormal.trigger('click')
    expect(wrapper.emitted().sendGA[0]).toEqual([
      {
        eventCategory: 'header',
        eventAction: 'click',
        eventLabel: `topic ${mockTopic.name}`,
      },
    ])

    const linkMore = wrapper.get(`[href="/section/topic"]`)
    linkMore.trigger('click')
    expect(wrapper.emitted().sendGA[1]).toEqual([
      {
        eventCategory: 'header',
        eventAction: 'click',
        eventLabel: 'topic 更多',
      },
    ])
  })

  test('with a proper argument when users click a sub-brand link', () => {
    const wrapper = createWrapper(UiHeaderNavTopic, {
      propsData: {
        subBrands: [mockSubBrand],
      },
    })

    const subBrandLink = wrapper.get(`[href="${mockSubBrand.href}"]`)
    subBrandLink.trigger('click')
    expect(wrapper.emitted().sendGA[0]).toEqual([
      {
        eventCategory: 'header',
        eventAction: 'click',
        eventLabel: `section ${mockSubBrand.name}`,
      },
    ])
  })
})
