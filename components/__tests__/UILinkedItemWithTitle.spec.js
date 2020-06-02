import UILinkedItemWithTitle from '../UILinkedItemWithTitle.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

describe('href', () => {
  test('render the proper href', () => {
    const href = '/video/TX1NNUXnETY'
    const createWrapper = createWrapperHelper({
      propsData: {
        imgSrc: '',
        href,
        title: '',
      },
    })
    const wrapper = createWrapper(UILinkedItemWithTitle)
    const links = wrapper.findAll('a')
    links.wrappers.forEach((link) => {
      expect(link.attributes().href).toBe(href)
    })
  })
})

describe('title', () => {
  const title = 'test'
  const createWrapper = createWrapperHelper({
    propsData: {
      imgSrc: '',
      href: '',
      title,
    },
  })
  const wrapper = createWrapper(UILinkedItemWithTitle)

  test('render the proper title', () => {
    const titleWrapper = wrapper.find('.linked-item__title')
    expect(titleWrapper.text()).toBe(title)
  })

  test('render the proper alt', () => {
    const image = wrapper.find('.linked-item__image img')
    expect(image.attributes().alt).toBe(title)
  })
})

describe('title', () => {
  const src = 'https://image.jpg'
  const createWrapper = createWrapperHelper({
    propsData: {
      imgSrc: src,
      href: '',
      title: '',
    },
  })
  const wrapper = createWrapper(UILinkedItemWithTitle)

  test('render the proper image src', () => {
    const image = wrapper.find('.linked-item__image > img')
    expect(image.attributes()['data-src']).toBe(src)
  })
})

describe('classname for style in md viewport', () => {
  test('render the proper default classname', () => {
    const createWrapper = createWrapperHelper({
      propsData: {
        imgSrc: '',
        href: '',
        title: '',
      },
    })
    const wrapper = createWrapper(UILinkedItemWithTitle)
    const item = wrapper.find('.linked-item')
    expect(item.classes()).toContain('align-bottom')
  })

  test('render the proper specific classname', () => {
    const textPositionInMdViewport = 'right'
    const createWrapper = createWrapperHelper({
      propsData: {
        imgSrc: '',
        href: '',
        title: '',
        textPositionInMdViewport,
      },
    })
    const wrapper = createWrapper(UILinkedItemWithTitle)
    const item = wrapper.find('.linked-item')
    expect(item.classes()).toContain('align-right')
  })
})

describe('limit title lines', () => {
  const limitLines = 3
  const createWrapper = createWrapperHelper({
    propsData: {
      imgSrc: '',
      href: '',
      title: '',
      limitLines,
    },
  })
  const wrapper = createWrapper(UILinkedItemWithTitle)
  const title = wrapper.find('.linked-item__title')
  test('render the specific classname ', () => {
    expect(title.classes()).toContain('limit-lines')
  })
})
