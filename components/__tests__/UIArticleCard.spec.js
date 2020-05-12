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
    const hrefPropsMockPathAbsolute = 'http://www.google.com'
    let wrapper = createWrapper(UIArticleCard, {
      propsData: {
        href: hrefPropsMockPathAbsolute,
        imgSrc: '',
        imgText: '',
        imgTextBackgroundColor: '',
        infoTitle: '',
        infoDescription: '',
      },
    })
    let link = wrapper.find('a')
    expect(link.attributes().href).toBe(hrefPropsMockPathAbsolute)

    const hrefPropsMockPathRelative = '/story/test-slug'
    wrapper = createWrapper(UIArticleCard, {
      propsData: {
        href: hrefPropsMockPathRelative,
        imgSrc: '',
        imgText: '',
        imgTextBackgroundColor: '',
        infoTitle: '',
        infoDescription: '',
      },
    })
    link = wrapper.find('a')
    expect(link.attributes().href).toBe(hrefPropsMockPathRelative)
  })
})

describe('GA event', () => {
  test('should send proper GA event', () => {
    const $ga = {
      event: jest.fn(),
    }
    const wrapper = createWrapper(UIArticleCard, {
      propsData: {
        href: '',
        imgSrc: '',
        imgText: '',
        imgTextBackgroundColor: '',
        infoTitle: '',
        infoDescription: '',
      },
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
        href: '',
        imgSrc,
        imgText: '',
        imgTextBackgroundColor: '',
        infoTitle: '',
        infoDescription: '',
      },
    })
    const img = wrapper.find('img')
    expect(img.attributes()['data-src']).toBe(imgSrc)
  })
  test('should render proper textContent from props "imgText"', () => {
    const imgText = 'section'
    const wrapper = createWrapper(UIArticleCard, {
      propsData: {
        href: '',
        imgSrc: '',
        imgText,
        imgTextBackgroundColor: '',
        infoTitle: '',
        infoDescription: '',
      },
    })
    const span = wrapper.find('span')
    expect(span.text()).toBe(imgText)
  })
  test('should render proper backgroundColor from props "imgTextBackgroundColor"', () => {
    const imgTextBackgroundColor = '#000000' // rgb(0, 0, 0)
    const wrapper = createWrapper(UIArticleCard, {
      propsData: {
        href: '',
        imgSrc: '',
        imgText: '',
        imgTextBackgroundColor,
        infoTitle: '',
        infoDescription: '',
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
        href: '',
        imgSrc: '',
        imgText: '',
        imgTextBackgroundColor: '',
        infoTitle,
        infoDescription: '',
      },
    })
    const h1 = wrapper.find('h1')
    expect(h1.text()).toBe(infoTitle)
  })
  test('should render proper textContent from props "description"', () => {
    const infoDescription = 'test description'
    const wrapper = shallowMount(UIArticleCard, {
      propsData: {
        href: '',
        imgSrc: '',
        imgText: '',
        imgTextBackgroundColor: '',
        infoTitle: '',
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
        href: '',
        imgSrc: '',
        imgText: '',
        imgTextBackgroundColor: '',
        infoTitle: '',
        infoDescription: '',
        infoBackgroundColor,
      },
    })
    const infoWrapper = wrapper.find('.bottom-wrapper')
    expect(infoWrapper.element.style['background-color']).toBe('rgb(0, 0, 0)')
  })
})
