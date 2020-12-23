import UiLinkedItemWithTitle from '../UiLinkedItemWithTitle.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper()

describe('href', () => {
  test('render the proper href', () => {
    const href = '/video/TX1NNUXnETY'
    const wrapper = createWrapper(UiLinkedItemWithTitle, {
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
  const wrapper = createWrapper(UiLinkedItemWithTitle, {
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
})

describe('image src', () => {
  test('render the proper image src', async () => {
    const src = 'https://image.jpg'
    const wrapper = await createWrapper(UiLinkedItemWithTitle, {
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

describe('target attribute', () => {
  test('render the proper target attribute', async () => {
    const target = '_self'
    const wrapper = await createWrapper(UiLinkedItemWithTitle, {
      propsData: {
        imgSrc: '',
        href: '',
        title: '',
        target,
      },
    })
    const links = wrapper.findAll('a')
    links.wrappers.forEach((link) => {
      expect(link.attributes().target).toBe(target)
    })
  })
})

describe('classname for style in md viewport', () => {
  test('render the proper default classname', () => {
    const wrapper = createWrapper(UiLinkedItemWithTitle, {
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
    const wrapper = createWrapper(UiLinkedItemWithTitle, {
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
    const limitedLines = 3
    const wrapper = createWrapper(UiLinkedItemWithTitle, {
      propsData: {
        imgSrc: '',
        href: '',
        title: '',
        limitedLines,
      },
    })
    const title = wrapper.get('.linked-item__title')
    expect(title.classes()).toContain('limited-lines')
  })
})

describe('emit click event', () => {
  const mockPropsData = {
    imgSrc: '',
    href: '',
    title: '',
  }

  test('emits click event when image is clicked', () => {
    const wrapper = createWrapper(UiLinkedItemWithTitle, {
      propsData: mockPropsData,
    })
    wrapper.get('.linked-item__image').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
  test('emits click event when title is clicked', () => {
    const wrapper = createWrapper(UiLinkedItemWithTitle, {
      propsData: mockPropsData,
    })
    wrapper.get('.linked-item__title').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
