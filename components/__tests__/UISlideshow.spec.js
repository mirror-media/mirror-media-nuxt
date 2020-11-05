import { createLocalVue } from '@vue/test-utils'
import { directive as swiper } from 'vue-awesome-swiper'

import UISlideshow from '../UISlideshow.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const localVue = createLocalVue()
localVue.directive('swiper', swiper)

const createWrapper = createWrapperHelper({ localVue })

describe('swiper', () => {
  test('has class name "swiper-wrapper"', () => {
    const wrapper = createWrapper(UISlideshow)

    expect(wrapper.find('.swiper-wrapper').exists()).toBe(true)
  })
})
