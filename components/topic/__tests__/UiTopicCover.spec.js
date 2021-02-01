import { mount, createLocalVue } from '@vue/test-utils'
import { directive as swiper } from 'vue-awesome-swiper'

import UiTopicCover from '../UiTopicCover.vue'

test('has the classes for journalists to customize the styles', function () {
  /* Arrange */
  const sut = mount(UiTopicCover, {
    propsData: {
      type: '',
      imgItems: [],
    },
  })

  /* Assert */
  expect(sut.find('.topic').exists()).toBe(true)
  expect(sut.find('.topic-title').exists()).toBe(true)
  expect(sut.find('.leading').exists()).toBe(true)
})

describe('when its type is "slideshow"', function () {
  test('display the content', function () {
    /* Arrange */
    const localVue = createLocalVue()
    localVue.directive('swiper', swiper)
    const imgItemMock = {
      id: 'test-id1',
      href: '/test-href',
      srcs: {
        mobile: 'test-img-mobile.png',
        tablet: 'test-img-tablet.png',
        desktop: 'test-img-desktop.png',
      },
      alt: 'test-alt',
    }
    const sut = mount(UiTopicCover, {
      localVue,
      propsData: {
        type: 'slideshow',
        imgItems: [imgItemMock],
      },
      stubs: ['SvgArrowPrev', 'SvgArrowNext'],
    })

    /* Assert */
    const slideshow = sut.get('[data-testid="slideshow"]')
    const pictureSources = slideshow.findAll('source')
    const slideImg = slideshow.get('img')

    expect(sut.find('.swiper-slide').exists()).toBe(true)
    expect(slideshow.get('a').attributes().href).toBe(imgItemMock.href)
    expect(pictureSources.at(0).attributes().srcset).toBe(
      imgItemMock.srcs.desktop
    )
    expect(pictureSources.at(1).attributes().srcset).toBe(
      imgItemMock.srcs.tablet
    )
    expect(slideImg.attributes().src).toBe(imgItemMock.srcs.mobile)
    expect(slideImg.attributes().alt).toBe(imgItemMock.alt)
  })
})
