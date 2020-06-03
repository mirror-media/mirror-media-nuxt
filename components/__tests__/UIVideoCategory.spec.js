import { shallowMount } from '@vue/test-utils'
import UILinkedItemWithTitle from '../UILinkedItemWithTitle.vue'
import UIVideoCategory from '../UIVideoCategory.vue'

describe('heading', () => {
  test('should have proper heading', () => {
    const heading = 'test'
    const wrapper = shallowMount(UIVideoCategory, {
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
    const wrapper = shallowMount(UIVideoCategory, {
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
    expect(wrapper.get('a').attributes().href).toBe(`/category/${name}`)
  })
})

describe('"items" props is empty array', () => {
  test('should not render UIVideoCategory if "items" props is empty array', () => {
    const wrapper = shallowMount(UIVideoCategory, {
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
    const wrapper = shallowMount(UIVideoCategory, {
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
