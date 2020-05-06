import { shallowMount } from '@vue/test-utils'
import _ from 'lodash'
import UIArticleCard from '../UIArticleCard.vue'

// customizer to overwrite properties if the source object properties are an empty object or an array, like overwrite store object/array by empty object/array.
const customizer = (objValue, srcValue) => {
  if (Array.isArray(srcValue)) {
    return srcValue
  }
  if (srcValue instanceof Object && Object.keys(srcValue).length === 0) {
    return srcValue
  }
}

// createWrapper factory
// usage: createWrapper({ mocks: {}, store: createStore({ getters: {} }), //... })
// if you want to overwrite default mounting options,
// or want to keep reference to a mock in test.
const createWrapper = (Component, overrides) => {
  const defaultMountingOptions = {
    mocks: {
      $router: {
        push: jest.fn(),
      },
      $ga: {
        event: jest.fn(),
      },
    },
  }
  return shallowMount(
    Component,
    _.mergeWith(defaultMountingOptions, overrides, customizer)
  )
}

describe('href behaviour', () => {
  test('should open a new tab if props "href" is matching "^https?://"', () => {
    const hrefPropsMockHttp = 'http://www.google.com'
    window.open = jest.fn()
    let wrapper = createWrapper(UIArticleCard, {
      propsData: {
        href: hrefPropsMockHttp,
      },
    })
    wrapper.trigger('click')
    expect(window.open).toHaveBeenCalledWith(
      hrefPropsMockHttp,
      '_blank',
      'noopener',
      'noreferrer'
    )
    const hrefPropsMockHttps = 'https://www.google.com'
    wrapper = createWrapper(UIArticleCard, {
      propsData: {
        href: hrefPropsMockHttps,
      },
    })
    wrapper.trigger('click')
    expect(window.open).toHaveBeenCalledWith(
      hrefPropsMockHttps,
      '_blank',
      'noopener',
      'noreferrer'
    )
  })
  test('should perform a router push if props href is not matching "^https?://"', () => {
    const hrefPropsMock = '/test'
    const $router = {
      push: jest.fn(),
    }
    const wrapper = createWrapper(UIArticleCard, {
      propsData: {
        href: hrefPropsMock,
      },
      mocks: {
        $router,
      },
    })
    wrapper.trigger('click')
    expect($router.push).toHaveBeenCalledWith(hrefPropsMock)
  })
})

describe('GA event', () => {
  test('should send proper GA event', () => {
    const $ga = {
      event: jest.fn(),
    }
    const wrapper = createWrapper(UIArticleCard, {
      mocks: {
        $ga,
      },
    })
    wrapper.trigger('click')
    expect($ga.event).toHaveBeenCalledWith({
      eventCategory: wrapper.vm.ga.eventCategory,
      eventAction: wrapper.vm.ga.eventAction,
      eventLabel: wrapper.vm.ga.eventLabel,
    })
  })
})

describe('images wrapper', () => {
  test('should render proper src', () => {
    const imgSrc = 'http://test.png'
    const wrapper = createWrapper(UIArticleCard, {
      propsData: {
        imgSrc,
      },
    })
    const img = wrapper.find('img')
    expect(img.attributes()['data-src']).toBe(imgSrc)
  })
  test('should render proper textContent from props "imgText"', () => {
    const imgText = 'section'
    const wrapper = createWrapper(UIArticleCard, {
      propsData: {
        imgText,
      },
    })
    const span = wrapper.find('span')
    expect(span.text()).toBe(imgText)
  })
  test('should render proper backgroundColor from props "imgTextBackgroundColor"', () => {
    const imgTextBackgroundColor = '#000000' // rgb(0, 0, 0)
    const wrapper = createWrapper(UIArticleCard, {
      propsData: {
        imgTextBackgroundColor,
      },
    })
    const span = wrapper.find('span')
    expect(span.element.style['background-color']).toBe('rgb(0, 0, 0)')
  })
})

describe('info wrapper', () => {
  test('should render proper textContent from props "title"', () => {
    const infoTitle = 'test title'
    const wrapper = shallowMount(UIArticleCard, {
      propsData: {
        infoTitle,
      },
    })
    const h1 = wrapper.find('h1')
    expect(h1.text()).toBe(infoTitle)
  })
  test('should render proper textContent from props "description"', () => {
    const infoDescription = 'test description'
    const wrapper = shallowMount(UIArticleCard, {
      propsData: {
        infoDescription,
      },
    })
    const p = wrapper.find('p')
    expect(p.text()).toBe(infoDescription)
  })
  test('should render proper backgroundColor from props "infoBackgroundColor"', () => {
    const infoBackgroundColor = '#000000' // rgb(0, 0, 0)
    const wrapper = createWrapper(UIArticleCard, {
      propsData: {
        infoBackgroundColor,
      },
    })
    const infoWrapper = wrapper.find('.bottom-wrapper')
    expect(infoWrapper.element.style['background-color']).toBe('rgb(0, 0, 0)')
  })
})
