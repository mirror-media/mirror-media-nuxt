import { shallowMount } from '@vue/test-utils'
import UIHeaderNavTopic from '../UIHeaderNavTopic.vue'

const topic = {
  name: '人造地獄',
  id: '5d8c26c23c4cad5f87630d37',
}

describe('topic nav', () => {
  const wrapper = shallowMount(UIHeaderNavTopic, {
    propsData: {
      topics: [topic],
    },
    stubs: ['nuxt-link'],
  })

  test('render the proper topic link', () => {
    const linkNormal = wrapper.find(`[to="/topic/${topic.id}"]`)
    expect(linkNormal.text()).toBe(topic.name)
  })
})

describe('emitGA method', () => {
  const wrapper = shallowMount(UIHeaderNavTopic, {
    propsData: {
      topics: [topic],
    },
    stubs: ['nuxt-link'],
  })

  beforeEach(function resetEmitted() {
    wrapper._emitted.sendGA = []
  })

  test('with a proper argument when user clicks a topic link', () => {
    const linkNormal = wrapper.find(`[to="/topic/${topic.id}"]`)
    linkNormal.trigger('click')
    expect(wrapper.emitted().sendGA[0]).toEqual([
      {
        eventCategory: 'header',
        eventAction: 'click',
        eventLabel: `topic ${topic.name}`,
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

  test('with a proper argument when user clicks a sub-brand link', () => {
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
    const wrapper = shallowMount(UIHeaderNavTopic, {
      propsData: {
        topics: [topic],
      },
      stubs: ['nuxt-link'],
    })

    expect(wrapper.element).toMatchSnapshot()
  })
})
