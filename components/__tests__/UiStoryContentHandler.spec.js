import { createLocalVue } from '@vue/test-utils'
import { directive as swiper } from 'vue-awesome-swiper'

import UiStoryContentHandler from '../UiStoryContentHandler.vue'
import UiSlideshow from '../UiSlideshow.vue'
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
    const wrapper = createWrapper(UiStoryContentHandler, {
      propsData: {
        paragraph: mockParagraph,
      },
    })

    const { prevEl, nextEl } = wrapper
      .findComponent(UiSlideshow)
      .props().options.navigation

    expect(wrapper.find(prevEl).exists()).toBe(true)
    expect(wrapper.find(nextEl).exists()).toBe(true)
  })

  test('has class name "swiper-slide"', () => {
    const wrapper = createWrapper(UiStoryContentHandler, {
      propsData: {
        paragraph: mockParagraph,
      },
    })

    expect(wrapper.find('.swiper-slide').exists()).toBe(true)
  })
})

describe('youtube', () => {
  test('display the correct content', () => {
    /* Arrange */
    const contentMock = {
      youtubeId: 1234,
      description: '測試圖說',
    }
    const sut = createWrapper(UiStoryContentHandler, {
      propsData: {
        paragraph: {
          type: 'youtube',
          content: [contentMock],
        },
      },
      stubs: ['ClientOnly', 'lazy-component'],
    })

    /* Assert */
    expect(sut.get('iframe').attributes().src).toBe(
      `https://www.youtube.com/embed/${contentMock.youtubeId}`
    )
    expect(sut.text()).toContain(contentMock.description)
  })
})
