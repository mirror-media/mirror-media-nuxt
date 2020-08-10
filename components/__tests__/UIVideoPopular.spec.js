import UILinkedItemWithTitle from '../UILinkedItemWithTitle.vue'
import UIVideoPopular from '../UIVideoPopular.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper()

describe('heading', () => {
  test('should have proper heading', () => {
    const wrapper = createWrapper(UIVideoPopular, {
      propsData: {
        items: [{}],
      },
    })
    expect(wrapper.text()).toContain('熱門影片')
  })
})

describe('props is empty array', () => {
  test('should not render UIVideoPopular if "items" props is empty array', () => {
    const wrapper = createWrapper(UIVideoPopular, {
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
    const wrapper = createWrapper(UIVideoPopular, {
      propsData: {
        items,
      },
    })
    const linkedItems = wrapper.findAllComponents(UILinkedItemWithTitle)
    expect(linkedItems).toHaveLength(items.length)
  })
})

describe('emit sendGA event', () => {
  test('emits sendGA when UILinkedItemWithTitle emits click', () => {
    const wrapper = createWrapper(UIVideoPopular, {
      propsData: {
        items: [{ videoId: 'test1' }],
      },
    })
    wrapper.findComponent(UILinkedItemWithTitle).vm.$emit('click')
    expect(wrapper.emitted('sendGA')).toHaveLength(1)
  })
})
