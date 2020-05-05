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
    expect(linkNormal.find('h2').text()).toBe(topic.name)

    const linkMore = wrapper.find('[to="/section/topic"]')
    expect(linkMore.find('h2').text()).toBe('更多')
  })
})

describe('sub-brand nav', () => {
  const wrapper = shallowMount(UIHeaderNavTopic, {
    propsData: {
      topics: [],
    },
    stubs: ['nuxt-link'],
  })

  test('render the proper sub-brand link', () => {
    const voiceLink = wrapper.find('[href="https://voice.mirrorfiction.com/"]')
    expect(voiceLink.attributes().target).toBe('_blank')
    expect(voiceLink.find('img').attributes().alt).toBe('鏡好聽')

    const fictionLink = wrapper.find('[href="https://www.mirrorfiction.com/"]')
    expect(fictionLink.attributes().target).toBe('_blank')
    expect(fictionLink.find('img').attributes().alt).toBe('鏡文學')

    const readrLink = wrapper.find('[href="https://www.readr.tw/"]')
    expect(readrLink.attributes().target).toBe('_blank')
    expect(readrLink.find('img').attributes().alt).toBe('READr 讀+')
  })
})

describe('emitGA', () => {
  const wrapper = shallowMount(UIHeaderNavTopic, {
    propsData: {
      topics: [topic],
    },
    stubs: ['nuxt-link'],
  })

  beforeEach(function resetEmitted() {
    wrapper._emitted.sendGA = []
  })

  test('with a proper argument when click topic link', () => {
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

  test('with a proper argument when click sub-brand link', () => {
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
