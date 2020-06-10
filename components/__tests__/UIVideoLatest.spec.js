import UILinkedItemWithTitle from '../UILinkedItemWithTitle.vue'
import UIVideoLatest from '../UIVideoLatest.vue'
import UIYoutubeIframe from '../UIYoutubeIframe.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper()

describe('heading', () => {
  test('should have proper heading', () => {
    const wrapper = createWrapper(UIVideoLatest, {
      propsData: {
        items: [{ videoId: 'test' }],
      },
    })
    expect(wrapper.text()).toContain('最新影片')
  })
})

describe('youtube iframe', () => {
  test('should have youtube iframe', () => {
    const wrapper = createWrapper(UIVideoLatest, {
      propsData: {
        items: [{ videoId: 'test' }],
      },
    })
    expect(wrapper.findComponent(UIYoutubeIframe).exists()).toBe(true)
  })
})

describe('props is empty array', () => {
  test('should not render UIVideoLatest if "latest" props is empty array', () => {
    const wrapper = createWrapper(UIVideoLatest, {
      propsData: {
        items: [],
      },
    })
    expect(wrapper.find('.video-latest').exists()).toBe(false)
  })
})

describe('latest items exclude the first item', () => {
  test('should render proper number of UILinkedItemWithTitle', () => {
    const items = [
      { videoId: 'test1' },
      { videoId: 'test2' },
      { videoId: 'test3' },
    ]
    const wrapper = createWrapper(UIVideoLatest, {
      propsData: {
        items,
      },
    })
    const linkedItems = wrapper.findAllComponents(UILinkedItemWithTitle)
    expect(linkedItems).toHaveLength(items.length - 1)
  })
  test('should render proper number of UILinkedItemWithTitle no more than 4', () => {
    const items = [
      { videoId: 'test1' },
      { videoId: 'test2' },
      { videoId: 'test3' },
      { videoId: 'test4' },
      { videoId: 'test5' },
      { videoId: 'test6' },
    ]
    const wrapper = createWrapper(UIVideoLatest, {
      propsData: {
        items,
      },
    })
    const linkedItems = wrapper.findAllComponents(UILinkedItemWithTitle)
    expect(linkedItems).toHaveLength(4)
  })
})
