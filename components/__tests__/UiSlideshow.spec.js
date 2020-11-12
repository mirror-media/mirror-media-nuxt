import { createLocalVue } from '@vue/test-utils'
import { directive as swiper } from 'vue-awesome-swiper'

import UiSlideshow from '../UiSlideshow.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const localVue = createLocalVue()
localVue.directive('swiper', swiper)

const createWrapper = createWrapperHelper({ localVue })

describe('swiper', () => {
  test('has class name "swiper-wrapper"', () => {
    const wrapper = createWrapper(UiSlideshow)

    expect(wrapper.find('.swiper-wrapper').exists()).toBe(true)
  })
})
