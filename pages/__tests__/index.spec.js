import flushPromises from 'flush-promises'

import Home, {
  GA_UTM_EDITOR_CHOICES,
  LATEST_ARTICLES_MIN_NUM,
  MICRO_AD_IDXES_INSERTED,
  EXTERNALS_IDX_START_INSERTED,
  EXTERNALS_MAX_RESULTS,
  transformContentOfFlashNews,
  getLabel,
} from '../index.vue'
import UiFlashNews from '~/components/UiFlashNews.vue'
import UiEditorChoices from '~/components/UiEditorChoices.vue'
import UiArticleListFocus from '~/components/UiArticleListFocus.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'
import { CATEGORY_ID_MARKETING, SITE_OG_IMG } from '~/constants/index.js'

const flashNewsRequiredMock = Array(3).fill({})

const createWrapper = createWrapperHelper({
  data() {
    return {
      flashNews: flashNewsRequiredMock,
    }
  },
  mocks: {
    $fetchList: () => Promise.resolve({}),
    $fetchExternals: () => Promise.resolve({}),
  },
  stubs: ['ClientOnly'],
})

const mockGrouped = [{}, {}, {}, {}]
const mockGroupedRelateds = [{}, {}, {}, {}]

describe('快訊', () => {
  test('transform contents of flash news', () => {
    const articleMock = {
      slug: 'test-slug',
      title: 'test title',
    }
    expect(transformContentOfFlashNews(articleMock)).toEqual({
      slug: articleMock.slug,
      title: articleMock.title,
      href: `/story/${articleMock.slug}/`,
    })
  })

  test('send a GA event when UiFlashNews emits a sendGa:article, sendGa:next or sendGa:prev', () => {
    /* Arrange */
    const $ga = { event: jest.fn() }
    const sut = createWrapper(Home, {
      mocks: { $ga },
    })

    /* Act */
    sut.getComponent(UiFlashNews).vm.$emit('sendGa:article')
    sut.getComponent(UiFlashNews).vm.$emit('sendGa:next')
    sut.getComponent(UiFlashNews).vm.$emit('sendGa:prev')

    /* Assert */
    ;['breakingnews title', 'breakingnews up', 'breakingnews down'].forEach(
      function assert(eventLabel, idx) {
        expect($ga.event).toHaveBeenNthCalledWith(idx + 1, {
          eventCategory: 'home',
          eventAction: 'click',
          eventLabel,
        })
      }
    )
  })
})

describe('編輯精選', () => {
  test('pass articles to UiEditorChoices', () => {
    /* Arrange */
    const choice1Mock = {
      slug: 'test-slug',
      title: 'test title',
      style: 'test style',
      heroImage: {
        image: {
          resizedTargets: {
            mobile: { url: 'test-hero-image-mobile.png' },
            tablet: { url: 'test-hero-image-tablet.png' },
          },
        },
      },
      sections: [
        {
          title: 'test section title',
          name: 'test-section-name',
        },
      ],
    }
    const choice2Mock = {
      slug: 'test-slug',
      style: 'projects',
    }
    const sut = createWrapper(Home, {
      data() {
        return {
          articleGrouped: {
            choices: [choice1Mock, choice2Mock],
          },
          flashNews: flashNewsRequiredMock,
        }
      },
    })

    /* Assert */
    const {
      articles: [article1, article2],
    } = sut.getComponent(UiEditorChoices).props()
    const { mobile, tablet } = choice1Mock.heroImage.image.resizedTargets
    const [section] = choice1Mock.sections

    expect(article1.slug).toBe(choice1Mock.slug)
    expect(article1.title).toBe(choice1Mock.title)

    expect(article1.href).toBe(
      `/story/${choice1Mock.slug}/?${GA_UTM_EDITOR_CHOICES}`
    )
    expect(article2.href).toBe(`/projects/${choice2Mock.slug}/`)

    expect(article1.imgSrc).toBe(tablet.url)
    expect(article1.imgSrcMobile).toBe(mobile.url)
    expect(article2.imgSrc).toBe(SITE_OG_IMG)
    expect(article2.imgSrcMobile).toBe(SITE_OG_IMG)

    expect(article1.label).toBe(section.title)
    expect(article1.sectionName).toBe(section.name)
  })

  test('send a GA event when UiEditorChoices emits a sendGa', () => {
    /* Arrange */
    const $ga = {
      event: jest.fn(),
    }
    const sut = createWrapper(Home, {
      mocks: { $ga },
    })

    /* Act */
    sut.getComponent(UiEditorChoices).vm.$emit('sendGa')

    /* Assert */
    expect($ga.event).toBeCalledWith({
      eventCategory: 'home',
      eventAction: 'click',
      eventLabel: 'choice',
    })
  })
})

describe('UiArticleListFocus', () => {
  test('render the correct number', () => {
    const wrapper = createWrapper(Home, {
      data() {
        return {
          articleGrouped: {
            grouped: mockGrouped,
          },
          flashNews: flashNewsRequiredMock,
        }
      },
    })

    const focusArticleLists = wrapper.findAllComponents(UiArticleListFocus)
    expect(focusArticleLists).toHaveLength(mockGrouped.length)
  })

  test('pass the correct value to prop articlesRelated', () => {
    const wrapper = createWrapper(Home, {
      data() {
        return {
          articleGrouped: {
            grouped: [{ relateds: mockGroupedRelateds }],
          },
          flashNews: flashNewsRequiredMock,
        }
      },
    })

    const focusArticleList = wrapper.findComponent(UiArticleListFocus)
    expect(focusArticleList.props().articlesRelated).toHaveLength(
      mockGroupedRelateds.length - 1
    )
  })
})

describe('最新文章', () => {
  test('最新文章不出現與編輯精選、焦點新聞相同的文章', async () => {
    const duplicateNum = 3

    await testDuplicate(LATEST_ARTICLES_MIN_NUM + duplicateNum, function assert(
      spyMethod
    ) {
      expect(spyMethod.mock.calls[0][0]).toHaveLength(LATEST_ARTICLES_MIN_NUM)
    })
  })

  test(`若篩選掉與編輯精選、焦點新聞相同的文章後，最新文章小於 ${LATEST_ARTICLES_MIN_NUM} 篇，則不篩選文章`, async () => {
    const duplicateNum = 3
    const originalNum = LATEST_ARTICLES_MIN_NUM - 1 + duplicateNum

    await testDuplicate(originalNum, function assert(spyMethod) {
      expect(spyMethod.mock.calls[0][0]).toHaveLength(originalNum)
    })
  })

  test(`廣告出現在第 ${MICRO_AD_IDXES_INSERTED.join('、')} 篇`, async () => {
    expect.assertions(MICRO_AD_IDXES_INSERTED.length)

    await testMicroAds(LATEST_ARTICLES_MIN_NUM, function assert(spyMethod) {
      MICRO_AD_IDXES_INSERTED.forEach((idxInserted, idxUnit) => {
        expect(spyMethod).nthCalledWith(idxUnit + 1, idxInserted, {
          idx: idxUnit,
          isMicroAd: true,
        })
      })
    })
  })

  test(`若最新文章小於 ${LATEST_ARTICLES_MIN_NUM} 篇，則不插入廣告`, async () => {
    expect.assertions(1)

    await testMicroAds(LATEST_ARTICLES_MIN_NUM - 1, function assert(spyMethod) {
      expect(spyMethod).not.toBeCalled()
    })
  })

  test(`合作媒體文章出現在第 ${EXTERNALS_IDX_START_INSERTED} 篇到第 ${
    EXTERNALS_IDX_START_INSERTED + EXTERNALS_MAX_RESULTS - 1
  } 篇`, async () => {
    await testExternals(EXTERNALS_IDX_START_INSERTED, function assert(
      spyMethod
    ) {
      expect(spyMethod).lastCalledWith(EXTERNALS_IDX_START_INSERTED)
    })
  })

  test(`若最新文章（包含廣告）小於 ${EXTERNALS_IDX_START_INSERTED} 篇，則不插入合作媒體文章`, async () => {
    await testExternals(
      EXTERNALS_IDX_START_INSERTED - 1 - MICRO_AD_IDXES_INSERTED.length,
      function assert(spyMethod) {
        expect(spyMethod).not.lastCalledWith(EXTERNALS_IDX_START_INSERTED)
      }
    )
  })

  async function testDuplicate(latestItemsNum, assert) {
    expect.assertions(1)

    /* Arrange */
    const spyPushLatestItems = jest.spyOn(Home.methods, 'pushLatestItems')

    createWrapper(Home, {
      data() {
        return {
          articleGrouped: {
            choices: [{ slug: '1' }],
            grouped: [{ slug: '2', relateds: [{ slug: '3' }] }],
          },
          flashNews: flashNewsRequiredMock,
        }
      },
      mocks: {
        $fetchList: () =>
          Promise.resolve({
            items: Array(latestItemsNum)
              .fill({})
              .map((_, idx) => ({
                slug: `${idx + 1}`,
              })),
          }),
      },
    })
    await flushPromises()

    /* Assert */
    assert(spyPushLatestItems)

    spyPushLatestItems.mockClear()
  }

  async function testMicroAds(latestItemsNum, assert) {
    /* Arrange */
    const spyInsertLatestItems = jest.spyOn(Home.methods, 'insertLatestItems')
    const sut = createWrapper(Home)

    /* Act */
    sut.setData({
      latestList: {
        items: Array(latestItemsNum).fill({}),
      },
    })
    await flushPromises()

    /* Assert */
    assert(spyInsertLatestItems)

    spyInsertLatestItems.mockClear()
  }

  async function testExternals(latestItemsNum, assert) {
    expect.assertions(1)

    /* Arrange */
    const spyInsertLatestItems = jest.spyOn(Home.methods, 'insertLatestItems')
    const sut = createWrapper(Home)

    /* Act */
    sut.setData({
      latestList: {
        items: Array(latestItemsNum).fill({}),
      },
    })
    await flushPromises()

    /* Assert */
    assert(spyInsertLatestItems)

    spyInsertLatestItems.mockClear()
  }
})

describe('getLabel method', () => {
  test('return "合作媒體" if the argument has a partner key', () => {
    expect(getLabel({ partner: {} })).toBe('合作媒體')
  })

  test('return section title if the argument has a sections key and does not have a partner key', () => {
    const sectionTitleMock = '娛樂'

    expect(getLabel({ sections: [{ title: sectionTitleMock }] })).toBe(
      sectionTitleMock
    )
  })

  test('return the category title if the argument has a categories key and does not have a partner and a sections key', () => {
    const categoryTitleMock = '焦點'

    expect(getLabel({ categories: [{ title: categoryTitleMock }] })).toBe(
      categoryTitleMock
    )
  })

  test("return the second category title if the argument's categories key has two categories and does not have a partner and a sections key, and its first category is '企劃特輯'", () => {
    const categoryTitleMock = '焦點'

    expect(
      getLabel({
        categories: [
          { id: CATEGORY_ID_MARKETING },
          { title: categoryTitleMock },
        ],
      })
    ).toBe(categoryTitleMock)
  })
})

/**
 * TODO: 待補測試
 * GA event
 * load more
 * getImg
 * getLabel
 */
