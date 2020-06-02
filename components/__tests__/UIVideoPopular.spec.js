import { shallowMount } from '@vue/test-utils'
import UILinkedItemWithTitle from '../UILinkedItemWithTitle.vue'
import UIVideoPopular from '../UIVideoPopular.vue'

describe('heading', () => {
  test('should have proper heading', () => {
    const wrapper = shallowMount(UIVideoPopular, {
      propsData: {
        items: [{}],
      },
    })
    expect(wrapper.get('.video-popular__heading').text()).toBe('熱門影片')
  })
})

describe('props is empty array', () => {
  test('should not render UIVideoPopular if "items" props is empty array', () => {
    const wrapper = shallowMount(UIVideoPopular, {
      propsData: {
        items: [],
      },
    })
    expect(wrapper.find('.video-popular').exists()).toBe(false)
  })
})

describe('items', () => {
  test('should render proper number of UILinkedItemWithTitle', () => {
    const items = [
      { videoId: 'test1' },
      { videoId: 'test2' },
      { videoId: 'test3' },
    ]
    const wrapper = shallowMount(UIVideoPopular, {
      propsData: {
        items,
      },
    })
    const linkedItems = wrapper.findAllComponents(UILinkedItemWithTitle)
    expect(linkedItems).toHaveLength(items.length)
  })
})
