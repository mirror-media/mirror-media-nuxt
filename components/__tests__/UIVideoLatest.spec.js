import { shallowMount } from '@vue/test-utils'
import UILinkedItemWithTitle from '../UILinkedItemWithTitle.vue'
import UIVideoLatest from '../UIVideoLatest.vue'
import UIYoutubeIframe from '../UIYoutubeIframe.vue'

describe('heading', () => {
  test('should have proper heading', () => {
    const wrapper = shallowMount(UIVideoLatest, {
      propsData: {
        latest: [{ videoId: 'test' }],
      },
    })
    expect(wrapper.get('.video-latest__heading').text()).toBe('最新影片')
  })
})

describe('youtube iframe', () => {
  test('should have youtube iframe', () => {
    const wrapper = shallowMount(UIVideoLatest, {
      propsData: {
        latest: [{ videoId: 'test' }],
      },
    })
    expect(wrapper.findComponent(UIYoutubeIframe).exists()).toBe(true)
  })
})

describe('props is empty array', () => {
  test('should not render UIVideoLatest if "latest" props is empty array', () => {
    const wrapper = shallowMount(UIVideoLatest, {
      propsData: {
        latest: [],
      },
    })
    expect(wrapper.find('.video-latest').exists()).toBe(false)
  })
})

describe('latest items exclude the first item', () => {
  test('should render proper number of UILinkedItemWithTitle', () => {
    const latest = [
      { videoId: 'test1' },
      { videoId: 'test2' },
      { videoId: 'test3' },
    ]
    const wrapper = shallowMount(UIVideoLatest, {
      propsData: {
        latest,
      },
    })
    const items = wrapper.findAllComponents(UILinkedItemWithTitle)
    expect(items).toHaveLength(latest.length - 1)
  })
  test('should render proper number of UILinkedItemWithTitle no more than 4', () => {
    const latest = [
      { videoId: 'test1' },
      { videoId: 'test2' },
      { videoId: 'test3' },
      { videoId: 'test4' },
      { videoId: 'test5' },
      { videoId: 'test6' },
    ]
    const wrapper = shallowMount(UIVideoLatest, {
      propsData: {
        latest,
      },
    })
    const items = wrapper.findAllComponents(UILinkedItemWithTitle)
    expect(items).toHaveLength(4)
  })
})
