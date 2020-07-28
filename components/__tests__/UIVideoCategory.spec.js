import UILinkedItemWithTitle from '../UILinkedItemWithTitle.vue'
import UIVideoCategory from '../UIVideoCategory.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper()

describe('heading', () => {
  test('should have proper heading', () => {
    const heading = 'test'
    const wrapper = createWrapper(UIVideoCategory, {
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
    const wrapper = createWrapper(UIVideoCategory, {
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
  test('should not render UIVideoCategory if "items" props is empty array', () => {
    const wrapper = createWrapper(UIVideoCategory, {
      propsData: {
        category: {},
        items: [],
      },
    })
    expect(wrapper.find('.video-category').exists()).toBe(false)
  })
})

describe('"items" props is not empty array', () => {
  test('UILinkedItemWithTitle should exist', () => {
    const wrapper = createWrapper(UIVideoCategory, {
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
    const items = wrapper.findAllComponents(UILinkedItemWithTitle)
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

  test('emits sendGA when first UILinkedItemWithTitle emits click', () => {
    const wrapper = createWrapper(UIVideoCategory, {
      propsData: mockPropsData,
    })
    wrapper.findComponent(UILinkedItemWithTitle).vm.$emit('click')
    expect(wrapper.emitted('sendGA')).toHaveLength(1)
  })

  test('emits sendGA when first item link is clicked', () => {
    const wrapper = createWrapper(UIVideoCategory, {
      propsData: mockPropsData,
    })
    wrapper.get('.video-category__category-link').trigger('click')
    expect(wrapper.emitted('sendGA')).toHaveLength(1)
  })

  test('emits sendGA when remaining UILinkedItemWithTitle emits click', () => {
    const wrapper = createWrapper(UIVideoCategory, {
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
    wrapper.findAllComponents(UILinkedItemWithTitle).at(1).vm.$emit('click')
    expect(wrapper.emitted('sendGA')).toHaveLength(1)
  })
})
