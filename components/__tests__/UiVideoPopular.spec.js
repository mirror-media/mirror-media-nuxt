import UiLinkedItemWithTitle from '../UiLinkedItemWithTitle.vue'
import UiVideoPopular from '../UiVideoPopular.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper()

describe('heading', () => {
  test('should have proper heading', () => {
    const wrapper = createWrapper(UiVideoPopular, {
      propsData: {
        items: [{}],
      },
    })
    expect(wrapper.text()).toContain('熱門影片')
  })
})

describe('props is empty array', () => {
  test('should not render UiVideoPopular if "items" props is empty array', () => {
    const wrapper = createWrapper(UiVideoPopular, {
      propsData: {
        items: [],
      },
    })
    expect(wrapper.find('.video-popular').exists()).toBe(false)
  })
})

describe('items', () => {
  test('should render proper number of UiLinkedItemWithTitle', () => {
    const items = [
      { videoId: 'test1' },
      { videoId: 'test2' },
      { videoId: 'test3' },
    ]
    const wrapper = createWrapper(UiVideoPopular, {
      propsData: {
        items,
      },
    })
    const linkedItems = wrapper.findAllComponents(UiLinkedItemWithTitle)
    expect(linkedItems).toHaveLength(items.length)
  })
})

describe('emit sendGa event', () => {
  test('emits sendGa when UiLinkedItemWithTitle emits click', () => {
    const wrapper = createWrapper(UiVideoPopular, {
      propsData: {
        items: [{ videoId: 'test1' }],
      },
    })
    wrapper.findComponent(UiLinkedItemWithTitle).vm.$emit('click')
    expect(wrapper.emitted('sendGa')).toHaveLength(1)
  })
})
