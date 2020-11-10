import UiLinkedItemWithTitle from '../UiLinkedItemWithTitle.vue'
import UiVideoCategory from '../UiVideoCategory.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper()

describe('heading', () => {
  test('should have proper heading', () => {
    const heading = 'test'
    const wrapper = createWrapper(UiVideoCategory, {
      propsData: {
        category: {
          title: heading,
        },
        items: [
          {
            thumbnails: '',
            title: '',
            videoId: '',
          },
        ],
      },
    })
    expect(wrapper.get('h1').text()).toBe(heading)
  })
})

describe('link to category page', () => {
  test('should have proper href', () => {
    const name = 'test'
    const wrapper = createWrapper(UiVideoCategory, {
      propsData: {
        category: {
          name,
        },
        items: [
          {
            thumbnails: '',
            title: '',
            videoId: '',
          },
        ],
      },
    })
    expect(wrapper.get('a').attributes().href).toBe(`/video_category/${name}`)
  })
})

describe('"items" props is empty array', () => {
  test('should not render UiVideoCategory if "items" props is empty array', () => {
    const wrapper = createWrapper(UiVideoCategory, {
      propsData: {
        category: {},
        items: [],
      },
    })
    expect(wrapper.find('.video-category').exists()).toBe(false)
  })
})

describe('"items" props is not empty array', () => {
  test('UiLinkedItemWithTitle should exist', () => {
    const wrapper = createWrapper(UiVideoCategory, {
      propsData: {
        category: {},
        items: [
          {
            thumbnails: '',
            title: '',
            videoId: '',
          },
        ],
      },
    })
    const items = wrapper.findAllComponents(UiLinkedItemWithTitle)
    expect(items.exists()).toBe(true)
  })
})

describe('emit sendGA event', () => {
  const mockPropsData = {
    category: {},
    items: [
      {
        thumbnails: '',
        title: '',
        videoId: '',
      },
    ],
  }

  test('emits sendGA when first UiLinkedItemWithTitle emits click', () => {
    const wrapper = createWrapper(UiVideoCategory, {
      propsData: mockPropsData,
    })
    wrapper.findComponent(UiLinkedItemWithTitle).vm.$emit('click')
    expect(wrapper.emitted('sendGA')).toHaveLength(1)
  })

  test('emits sendGA when first item link is clicked', () => {
    const wrapper = createWrapper(UiVideoCategory, {
      propsData: mockPropsData,
    })
    wrapper.get('.video-category__category-link').trigger('click')
    expect(wrapper.emitted('sendGA')).toHaveLength(1)
  })

  test('emits sendGA when remaining UiLinkedItemWithTitle emits click', () => {
    const wrapper = createWrapper(UiVideoCategory, {
      propsData: {
        category: {},
        items: [
          {
            thumbnails: '',
            title: '',
            videoId: '',
          },
          {
            thumbnails: '',
            title: '',
            videoId: '',
          },
        ],
      },
    })
    wrapper.findAllComponents(UiLinkedItemWithTitle).at(1).vm.$emit('click')
    expect(wrapper.emitted('sendGA')).toHaveLength(1)
  })
})
