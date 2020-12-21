import UiArticleListFocus from '../UiArticleListFocus.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const mockAricleMain = {
  title: '圓佛洛伊德遺願',
  href: '/test-href-main/',
  imgSrc: 'test-src',
}
const mockArticlesRelated = {
  slug: '20200603edi031',
  title: '洛杉磯面目全非',
  href: '/test-href-related/',
}

const createWrapper = createWrapperHelper({
  propsData: {
    articleMain: mockAricleMain,
    articlesRelated: [mockArticlesRelated],
  },
})

describe('main article', () => {
  test('render the proper content', () => {
    const wrapper = createWrapper(UiArticleListFocus)

    const mainLink = wrapper.get(`[href="${mockAricleMain.href}"]`)

    // expect(mainLink.get('img').attributes().src).toBe(
    //   mockAricleMain.heroImage.image.resizedTargets.mobile.url
    // )
    expect(mainLink.get('h1').text()).toBe(mockAricleMain.title)
  })
})

describe('related articles', () => {
  test('render the proper content', () => {
    const wrapper = createWrapper(UiArticleListFocus)

    const relatedLink = wrapper.get(`[href="${mockArticlesRelated.href}"]`)
    expect(relatedLink.get('h1').text()).toBe(mockArticlesRelated.title)
  })
})

describe('emitGa method', () => {
  test('with a proper argument when users click an article link', () => {
    const wrapper = createWrapper(UiArticleListFocus)
    const gaArgs = {
      eventCategory: 'home',
      eventAction: 'click',
      eventLabel: 'group',
    }

    const mainLink = wrapper.get(`[href="${mockAricleMain.href}"]`)
    mainLink.trigger('click')
    expect(wrapper.emitted().sendGa[0]).toEqual([gaArgs])

    const relatedLink = wrapper.get(`[href="${mockArticlesRelated.href}"]`)
    relatedLink.trigger('click')
    expect(wrapper.emitted().sendGa[1]).toEqual([gaArgs])
  })
})
