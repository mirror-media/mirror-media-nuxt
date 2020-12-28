import flushPromises from 'flush-promises'

import UiArticleListFocus from '../UiArticleListFocus.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  propsData: {
    articleMain: {},
    articlesRelated: [],
  },
})

const articleMainMock = {
  title: 'test-title-main',
  href: '/test-href-main/',
  imgSrc: 'test-src',
}
const articlesRelated1Mock = {
  slug: 'test-slug-1',
  title: 'test-title-related-1',
  href: '/test-href-related-1/',
}
const articlesRelated2Mock = {
  slug: 'test-slug-2',
  title: 'test-title-related-2',
  href: '/test-href-related-2/',
}

test('display the articles', async function () {
  expect.assertions(7)

  /* Arrange */
  const sut = createWrapper(UiArticleListFocus, {
    propsData: {
      articleMain: articleMainMock,
      articlesRelated: [articlesRelated1Mock, articlesRelated2Mock],
    },
  })

  // for v-lazy
  await flushPromises()

  /* Assert */
  expect(sut.get('img').attributes()['data-src']).toBe(articleMainMock.imgSrc)

  const links = sut.findAll('a')
  expect(links.at(0).attributes().href).toBe(articleMainMock.href)
  expect(links.at(1).attributes().href).toBe(articlesRelated1Mock.href)
  expect(links.at(2).attributes().href).toBe(articlesRelated2Mock.href)

  const titles = sut.findAll('h1')
  expect(titles.at(0).text()).toBe(articleMainMock.title)
  expect(titles.at(1).text()).toBe(articlesRelated1Mock.title)
  expect(titles.at(2).text()).toBe(articlesRelated2Mock.title)
})

test('send the GA event when users click the link of an article', function () {
  /* Arrange */
  const sut = createWrapper(UiArticleListFocus, {
    propsData: {
      articleMain: articleMainMock,
      articlesRelated: [articlesRelated1Mock],
    },
  })

  const links = sut.findAll('a')

  for (let i = 0; i < links.length; i += 1) {
    /* Act */
    links.at(i).trigger('click')

    /* Assert */
    expect(sut.emitted().sendGa[i]).toBeTruthy()
  }
})
