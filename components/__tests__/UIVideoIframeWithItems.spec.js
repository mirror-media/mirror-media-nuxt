import UILinkedItemWithTitle from '../UILinkedItemWithTitle.vue'
import UIVideoIframeWithItems from '../UIVideoIframeWithItems.vue'
import UIYoutubeIframe from '../UIYoutubeIframe.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  mocks: {
    $ua: {
      isFromPc() {
        return true
      },
    },
  },
  stubs: ['client-only', 'GPTAD'],
})

describe('the first item link', () => {
  test('should have proper link href', () => {
    const videoId = 'test'
    const wrapper = createWrapper(UIVideoIframeWithItems, {
      propsData: {
        items: [{ videoId }],
      },
    })
    const link = wrapper.get('a')
    expect(link.attributes().href).toBe(`/video/${videoId}`)
  })
})

describe('youtube iframe', () => {
  test('should have youtube iframe', () => {
    const wrapper = createWrapper(UIVideoIframeWithItems, {
      propsData: {
        items: [{ videoId: 'test' }],
      },
    })
    expect(wrapper.findComponent(UIYoutubeIframe).exists()).toBe(true)
  })
})

describe('props is empty array', () => {
  test('should not render UIVideoIframeWithItems if "items" props is empty array', () => {
    const wrapper = createWrapper(UIVideoIframeWithItems, {
      propsData: {
        items: [],
      },
    })
    expect(wrapper.find('.video-iframe-items').exists()).toBe(false)
  })
})

describe('items exclude the first item', () => {
  test('should render proper number of UILinkedItemWithTitle', () => {
    const items = [
      { videoId: 'test1' },
      { videoId: 'test2' },
      { videoId: 'test3' },
    ]
    const wrapper = createWrapper(UIVideoIframeWithItems, {
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
    const wrapper = createWrapper(UIVideoIframeWithItems, {
      propsData: {
        items,
      },
    })
    const linkedItems = wrapper.findAllComponents(UILinkedItemWithTitle)
    expect(linkedItems).toHaveLength(4)
  })
})

describe('emit sendGA event', () => {
  const mockPropsData = {
    items: [{ videoId: 'test1' }, { videoId: 'test2' }],
  }
  test('emits sendGA when first item link is clicked', () => {
    const wrapper = createWrapper(UIVideoIframeWithItems, {
      propsData: mockPropsData,
    })
    wrapper.get('.video-iframe-items__first-title').trigger('click')
    expect(wrapper.emitted('sendGA')).toHaveLength(1)
  })
  test('emits sendGA when UILinkedItemWithTitle emits click', () => {
    const wrapper = createWrapper(UIVideoIframeWithItems, {
      propsData: mockPropsData,
    })
    wrapper.findComponent(UILinkedItemWithTitle).vm.$emit('click')
    expect(wrapper.emitted('sendGA')).toHaveLength(1)
  })
})
