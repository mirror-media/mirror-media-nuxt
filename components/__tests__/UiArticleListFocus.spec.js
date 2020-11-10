import UiArticleListFocus from '../UiArticleListFocus.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'
import { getHref } from '~/plugins/article/href'
import { getImage } from '~/plugins/article/image'

const mockAricleMain = {
  slug: '20200603edi030',
  style: 'article',
  title: '圓佛洛伊德遺願',
  heroImage: {
    image: {
      resizedTargets: {
        mobile: {
          url:
            'https://www.mirrormedia.com.tw/assets/images/20200603180826-f1a34611e6b587aa9051d51d14bc45f0-mobile.jpg',
        },
      },
    },
  },
}
const mockArticlesRelated = {
  slug: '20200603edi031',
  style: 'article',
  title: '洛杉磯面目全非',
}

const createWrapper = createWrapperHelper({
  propsData: {
    articleMain: mockAricleMain,
    articlesRelated: [mockArticlesRelated],
  },
  mocks: {
    $getHref: getHref,
    $getImage: getImage,
  },
})

describe('main article', () => {
  test('render the proper content', () => {
    const wrapper = createWrapper(UiArticleListFocus)

    const mainLink = wrapper.get(`[href="/story/${mockAricleMain.slug}/"]`)

    // expect(mainLink.get('img').attributes().src).toBe(
    //   mockAricleMain.heroImage.image.resizedTargets.mobile.url
    // )
    expect(mainLink.get('h1').text()).toBe(mockAricleMain.title)
  })
})

describe('related articles', () => {
  test('render the proper content', () => {
    const wrapper = createWrapper(UiArticleListFocus)

    const relatedLink = wrapper.get(
      `[href="/story/${mockArticlesRelated.slug}/"]`
    )
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

    const mainLink = wrapper.get(`[href="/story/${mockAricleMain.slug}/"]`)
    mainLink.trigger('click')
    expect(wrapper.emitted().sendGa[0]).toEqual([gaArgs])

    const relatedLink = wrapper.get(
      `[href="/story/${mockArticlesRelated.slug}/"]`
    )
    relatedLink.trigger('click')
    expect(wrapper.emitted().sendGa[1]).toEqual([gaArgs])
  })
})
