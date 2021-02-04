import { createLocalVue } from '@vue/test-utils'
import { directive as swiper } from 'vue-awesome-swiper'

import UiStoryContentHandler from '../UiStoryContentHandler.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const localVue = createLocalVue()
localVue.directive('swiper', swiper)

const createWrapper = createWrapperHelper({
  localVue,
  stubs: ['ClientOnly', 'LazyRenderer'],
})

describe('slideshow', () => {
  test('has class name "swiper-slide"', () => {
    const wrapper = createWrapper(UiStoryContentHandler, {
      propsData: {
        paragraph: {
          type: 'slideshow',
          content: [
            {
              id: 1,
              mobile: { url: 'http://www.mirrormedia.mg/' },
              description: '中秋酒禮',
            },
          ],
        },
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
    })

    /* Assert */
    expect(sut.get('iframe').attributes().src).toBe(
      `https://www.youtube.com/embed/${contentMock.youtubeId}`
    )
    expect(sut.text()).toContain(contentMock.description)
  })
})
