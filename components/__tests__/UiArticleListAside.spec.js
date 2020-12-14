import UiArticleListAside from '../UiArticleListAside.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  propsData: {
    items: [{}],
  },
})

test('display the content', () => {
  /* Arrange */
  const headingMock = 'test heading'
  const itemMock = {
    slug: 'test-slug',
    title: 'test title',
    href: 'test-href/',
    imgSrc: 'test-src.png',
    label: 'test label',
    sectionName: 'test-section-name',
  }

  const sut = createWrapper(UiArticleListAside, {
    propsData: {
      heading: headingMock,
      items: [itemMock],
    },
  })

  /* Assert */
  expect(sut.get('.heading').text()).toBe(headingMock)

  expect(sut.get('.item__title').text()).toBe(itemMock.title)

  expect(sut.get('.item__image').attributes().href).toBe(itemMock.href)
  expect(sut.get('.item__title').attributes().href).toBe(itemMock.href)

  expect(sut.get('.item__image img').attributes().src).toBe(itemMock.imgSrc)

  expect(sut.get('.item__image .item__label').text()).toBe(itemMock.label)
  expect(sut.get('.item__title-wrapper .item__label').text()).toBe(
    itemMock.label
  )

  expect(sut.get('.item').classes()).toContain(itemMock.sectionName)
})

test('do not show the heading when it is not set', () => {
  const sut = createWrapper(UiArticleListAside)

  expect(sut.find('.heading').exists()).toBe(false)
})
