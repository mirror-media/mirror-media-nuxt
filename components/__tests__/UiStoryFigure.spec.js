import UiStoryFigure from '../UiStoryFigure.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper()

test('display the correct content', async () => {
  /* Arrange */
  const contentMock = {
    alignment: 'left',
    description: '圖說',
    tablet: { url: 'http://google.com/tablet.png' },
    desktop: { url: 'http://google.com/desktop.png' },
  }

  const sut = createWrapper(UiStoryFigure, {
    propsData: {
      content: contentMock,
    },
    data() {
      return {
        shouldOpenLightbox: true,
      }
    },
  })

  // for v-lazy
  await sut.vm.$nextTick()

  /* Assert */
  expect(sut.get('.story-figure').classes()).toContain(contentMock.alignment)
  expect(sut.get('figure img').html()).toContain(contentMock.tablet.url)
  expect(sut.text()).toContain(contentMock.description)
  expect(sut.get('.lightbox img').html()).toContain(contentMock.desktop.url)
})

describe('lightbox', () => {
  test('open the lightbox when users click the image', async () => {
    const sut = createWrapper(UiStoryFigure)

    await sut.get('figure img').trigger('click')

    expect(sut.find('.lightbox').exists()).toBe(true)
  })

  test('close the lightbox when users click outside of the lightbox image', async () => {
    const sut = createWrapper(UiStoryFigure, {
      data() {
        return {
          shouldOpenLightbox: true,
        }
      },
    })

    await sut.get('.lightbox').trigger('click')

    expect(sut.find('.lightbox').exists()).toBe(false)
  })

  test('do not close the lightbox when users click the lightbox image', async () => {
    const sut = createWrapper(UiStoryFigure, {
      data() {
        return {
          shouldOpenLightbox: true,
        }
      },
    })

    await sut.get('.lightbox img').trigger('click')

    expect(sut.find('.lightbox').exists()).toBe(true)
  })
})
