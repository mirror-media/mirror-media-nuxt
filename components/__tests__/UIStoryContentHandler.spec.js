import { createLocalVue } from '@vue/test-utils'
import { directive as swiper } from 'vue-awesome-swiper'

import UIStoryContentHandler from '../UIStoryContentHandler.vue'
import UISlideshow from '../UISlideshow.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const localVue = createLocalVue()
localVue.directive('swiper', swiper)

const createWrapper = createWrapperHelper({ localVue })

describe('slideshow', () => {
  const mockParagraph = {
    type: 'slideshow',
    content: [
      {
        id: 1,
        mobile: { url: 'http://www.mirrormedia.mg/' },
        description: '中秋酒禮',
      },
    ],
  }

  test('class name of slot "btn**" is equal to options.navigation.**El', () => {
    const wrapper = createWrapper(UIStoryContentHandler, {
      propsData: {
        paragraph: mockParagraph,
      },
    })

    const { prevEl, nextEl } = wrapper
      .findComponent(UISlideshow)
      .props().options.navigation

    expect(wrapper.find(prevEl).exists()).toBe(true)
    expect(wrapper.find(nextEl).exists()).toBe(true)
  })

  test('has class name "swiper-slide"', () => {
    const wrapper = createWrapper(UIStoryContentHandler, {
      propsData: {
        paragraph: mockParagraph,
      },
    })

    expect(wrapper.find('.swiper-slide').exists()).toBe(true)
  })
})
