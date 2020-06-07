import UILinkedItemWithTitle from '../UILinkedItemWithTitle.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper()

describe('href', () => {
  test('render the proper href', () => {
    const href = '/video/TX1NNUXnETY'
    const wrapper = createWrapper(UILinkedItemWithTitle, {
      propsData: {
        imgSrc: '',
        href,
        title: '',
      },
    })
    const links = wrapper.findAll('a')
    links.wrappers.forEach((link) => {
      expect(link.attributes().href).toBe(href)
    })
  })
})

describe('title', () => {
  const title = 'test'
  const wrapper = createWrapper(UILinkedItemWithTitle, {
    propsData: {
      imgSrc: '',
      href: '',
      title,
    },
  })

  test('render the proper title', () => {
    const titleWrapper = wrapper.get('.linked-item__title')
    expect(titleWrapper.text()).toBe(title)
  })

  test('render the proper img alt', () => {
    const image = wrapper.get('img')
    expect(image.attributes().alt).toBe(title)
  })
})

describe('image src', () => {
  test('render the proper image src', async () => {
    const src = 'https://image.jpg'
    const wrapper = await createWrapper(UILinkedItemWithTitle, {
      propsData: {
        imgSrc: src,
        href: '',
        title: '',
      },
    })
    const image = wrapper.get('img')
    expect(image.attributes()['data-src']).toBe(src)
  })
})

describe('classname for style in md viewport', () => {
  test('render the proper default classname', () => {
    const wrapper = createWrapper(UILinkedItemWithTitle, {
      propsData: {
        imgSrc: '',
        href: '',
        title: '',
      },
    })
    const item = wrapper.get('.linked-item')
    expect(item.classes()).toContain('align-bottom')
  })

  test('render the proper specific classname', () => {
    const textPositionInMdViewport = 'right'
    const wrapper = createWrapper(UILinkedItemWithTitle, {
      propsData: {
        imgSrc: '',
        href: '',
        title: '',
        textPositionInMdViewport,
      },
    })
    const item = wrapper.get('.linked-item')
    expect(item.classes()).toContain('align-right')
  })
})

describe('limit title lines', () => {
  test('render the specific classname', () => {
    const limitLines = 3
    const wrapper = createWrapper(UILinkedItemWithTitle, {
      propsData: {
        imgSrc: '',
        href: '',
        title: '',
        limitLines,
      },
    })
    const title = wrapper.get('.linked-item__title')
    expect(title.classes()).toContain('limit-lines')
  })
})
