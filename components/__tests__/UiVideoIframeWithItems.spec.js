import UiLinkedItemWithTitle from '../UiLinkedItemWithTitle.vue'
import UiVideoIframeWithItems from '../UiVideoIframeWithItems.vue'
import UiYoutubeIframe from '../UiYoutubeIframe.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper()

describe('the first item link', () => {
  test('should have proper link href', () => {
    const videoId = 'test'
    const wrapper = createWrapper(UiVideoIframeWithItems, {
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
    const wrapper = createWrapper(UiVideoIframeWithItems, {
      propsData: {
        items: [{ videoId: 'test' }],
      },
    })
    expect(wrapper.findComponent(UiYoutubeIframe).exists()).toBe(true)
  })
})

describe('props is empty array', () => {
  test('should not render UiVideoIframeWithItems if "items" props is empty array', () => {
    const wrapper = createWrapper(UiVideoIframeWithItems, {
      propsData: {
        items: [],
      },
    })
    expect(wrapper.find('.video-iframe-items').exists()).toBe(false)
  })
})

describe('items exclude the first item', () => {
  test('should render proper number of UiLinkedItemWithTitle', () => {
    const items = [
      { videoId: 'test1' },
      { videoId: 'test2' },
      { videoId: 'test3' },
    ]
    const wrapper = createWrapper(UiVideoIframeWithItems, {
      propsData: {
        items,
      },
    })
    const linkedItems = wrapper.findAllComponents(UiLinkedItemWithTitle)
    expect(linkedItems).toHaveLength(items.length - 1)
  })
  test('should render proper number of UiLinkedItemWithTitle no more than 4', () => {
    const items = [
      { videoId: 'test1' },
      { videoId: 'test2' },
      { videoId: 'test3' },
      { videoId: 'test4' },
      { videoId: 'test5' },
      { videoId: 'test6' },
    ]
    const wrapper = createWrapper(UiVideoIframeWithItems, {
      propsData: {
        items,
      },
    })
    const linkedItems = wrapper.findAllComponents(UiLinkedItemWithTitle)
    expect(linkedItems).toHaveLength(4)
  })
})

describe('emit sendGa event', () => {
  const mockPropsData = {
    items: [{ videoId: 'test1' }, { videoId: 'test2' }],
  }
  test('emits sendGa when first item link is clicked', () => {
    const wrapper = createWrapper(UiVideoIframeWithItems, {
      propsData: mockPropsData,
    })
    wrapper.get('.video-iframe-items__first-title').trigger('click')
    expect(wrapper.emitted('sendGa')).toHaveLength(1)
  })
  test('emits sendGa when UiLinkedItemWithTitle emits click', () => {
    const wrapper = createWrapper(UiVideoIframeWithItems, {
      propsData: mockPropsData,
    })
    wrapper.findComponent(UiLinkedItemWithTitle).vm.$emit('click')
    expect(wrapper.emitted('sendGa')).toHaveLength(1)
  })
})
