import UIHeaderNavTopic from '../UIHeaderNavTopic.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const mockTopic = {
  name: '人造地獄',
  id: '5d8c26c23c4cad5f87630d37',
}
const createWrapper = createWrapperHelper({
  propsData: {
    topics: [mockTopic],
  },
  stubs: ['nuxt-link'],
})

describe('topic nav', () => {
  test('render the proper topic link', () => {
    const wrapper = createWrapper(UIHeaderNavTopic)

    const linkNormal = wrapper.find(`[to="/topic/${mockTopic.id}"]`)
    expect(linkNormal.text()).toBe(mockTopic.name)
  })
})

describe('emitGA method', () => {
  test('with a proper argument when users click a topic link', () => {
    const wrapper = createWrapper(UIHeaderNavTopic)

    const linkNormal = wrapper.find(`[to="/topic/${mockTopic.id}"]`)
    linkNormal.trigger('click')
    expect(wrapper.emitted().sendGA[0]).toEqual([
      {
        eventCategory: 'header',
        eventAction: 'click',
        eventLabel: `topic ${mockTopic.name}`,
      },
    ])

    const linkMore = wrapper.find(`[to="/section/topic"]`)
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
    const wrapper = createWrapper(UIHeaderNavTopic)

    const voiceLink = wrapper.find('[href="https://voice.mirrorfiction.com/"]')
    voiceLink.trigger('click')
    expect(wrapper.emitted().sendGA[0]).toEqual([
      {
        eventCategory: 'header',
        eventAction: 'click',
        eventLabel: 'section mirrorvoice',
      },
    ])

    const fictionLink = wrapper.find('[href="https://www.mirrorfiction.com/"]')
    fictionLink.trigger('click')
    expect(wrapper.emitted().sendGA[1]).toEqual([
      {
        eventCategory: 'header',
        eventAction: 'click',
        eventLabel: 'section mirrorfiction',
      },
    ])

    const readrLink = wrapper.find('[href="https://www.readr.tw/"]')
    readrLink.trigger('click')
    expect(wrapper.emitted().sendGA[2]).toEqual([
      {
        eventCategory: 'header',
        eventAction: 'click',
        eventLabel: 'section readr',
      },
    ])
  })
})

describe('markup', () => {
  test('render correctly', () => {
    const wrapper = createWrapper(UIHeaderNavTopic)

    expect(wrapper.element).toMatchSnapshot()
  })
})
