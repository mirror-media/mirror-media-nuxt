import { shallowMount } from '@vue/test-utils'
import UiArticleCard from '../UiArticleCard.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  mocks: {
    $router: {
      push: jest.fn(),
    },
    $ga: {
      event: jest.fn(),
    },
  },
})

describe('href behaviour', () => {
  test('should open a new tab if props "href" is matching "^https?://"', () => {
    const hrefPropsMockPathAbsolute = 'http://www.google.com'
    let wrapper = createWrapper(UiArticleCard, {
      propsData: {
        href: hrefPropsMockPathAbsolute,
        imgSrc: '',
        imgText: '',
        imgTextBackgroundColor: '',
        infoTitle: '',
        infoDescription: '',
      },
    })
    let link = wrapper.get('a')
    expect(link.attributes().href).toBe(hrefPropsMockPathAbsolute)

    const hrefPropsMockPathRelative = '/story/test-slug'
    wrapper = createWrapper(UiArticleCard, {
      propsData: {
        href: hrefPropsMockPathRelative,
        imgSrc: '',
        imgText: '',
        imgTextBackgroundColor: '',
        infoTitle: '',
        infoDescription: '',
      },
    })
    link = wrapper.get('a')
    expect(link.attributes().href).toBe(hrefPropsMockPathRelative)
  })
})

describe('Ga event', () => {
  test('should send proper Ga event', () => {
    const $ga = {
      event: jest.fn(),
    }
    const wrapper = createWrapper(UiArticleCard, {
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
    expect($ga.event).toBeCalledWith({
      eventCategory: wrapper.vm.ga.eventCategory,
      eventAction: wrapper.vm.ga.eventAction,
      eventLabel: wrapper.vm.ga.eventLabel,
    })
  })
})

describe('images wrapper', () => {
  test('should render proper src', () => {
    const imgSrc = 'http://test.png'
    const wrapper = createWrapper(UiArticleCard, {
      propsData: {
        href: '',
        imgSrc,
        imgText: '',
        imgTextBackgroundColor: '',
        infoTitle: '',
        infoDescription: '',
      },
    })
    const img = wrapper.get('img')
    expect(img.attributes()['data-src']).toBe(imgSrc)
  })
  test('should render proper textContent from props "imgText"', () => {
    const imgText = 'section'
    const wrapper = createWrapper(UiArticleCard, {
      propsData: {
        href: '',
        imgSrc: '',
        imgText,
        imgTextBackgroundColor: '',
        infoTitle: '',
        infoDescription: '',
      },
    })
    const span = wrapper.get('span')
    expect(span.text()).toBe(imgText)
  })
  test('should hide the span if props "imgText" is empty string', () => {
    const imgText = ''
    const wrapper = createWrapper(UiArticleCard, {
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
    expect(span.exists()).toBe(false)
  })
  test('should render proper backgroundColor from props "imgTextBackgroundColor"', () => {
    const imgTextBackgroundColor = '#000000' // rgb(0, 0, 0)
    const wrapper = createWrapper(UiArticleCard, {
      propsData: {
        href: '',
        imgSrc: '',
        imgText: 'not empty string',
        imgTextBackgroundColor,
        infoTitle: '',
        infoDescription: '',
      },
    })
    const span = wrapper.get('span')
    expect(span.element.style['background-color']).toBe('rgb(0, 0, 0)')
  })
})

describe('info wrapper', () => {
  test('should render proper textContent from props "title"', () => {
    const infoTitle = 'test title'
    const wrapper = shallowMount(UiArticleCard, {
      propsData: {
        href: '',
        imgSrc: '',
        imgText: '',
        imgTextBackgroundColor: '',
        infoTitle,
        infoDescription: '',
      },
    })
    const h1 = wrapper.get('h1')
    expect(h1.text()).toBe(infoTitle)
  })
  test('should render proper textContent from props "description"', () => {
    const infoDescription = 'test description'
    const wrapper = shallowMount(UiArticleCard, {
      propsData: {
        href: '',
        imgSrc: '',
        imgText: '',
        imgTextBackgroundColor: '',
        infoTitle: '',
        infoDescription,
      },
    })
    const p = wrapper.get('p')
    expect(p.text()).toBe(infoDescription)
  })
  test('should render proper backgroundColor from props "infoBackgroundColor"', () => {
    const infoBackgroundColor = '#000000' // rgb(0, 0, 0)
    const wrapper = createWrapper(UiArticleCard, {
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
    const infoWrapper = wrapper.get('.bottom-wrapper')
    expect(infoWrapper.element.style['background-color']).toBe('rgb(0, 0, 0)')
  })
})
