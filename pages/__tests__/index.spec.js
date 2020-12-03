import flushPromises from 'flush-promises'

import Home, {
  LATEST_ARTICLES_MIN_NUM,
  MICRO_AD_IDXES_INSERTED,
  EXTERNALS_IDX_START_INSERTED,
  EXTERNALS_MAX_RESULTS,
  getLabel,
} from '../index.vue'
import UiArticleListFocus from '~/components/UiArticleListFocus.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'
import { CATEGORY_ID_MARKETING } from '~/constants/index.js'

const createWrapper = createWrapperHelper({
  mocks: {
    $fetchList: () => Promise.resolve({}),
    $fetchExternals: () => Promise.resolve({}),
  },
  stubs: ['ClientOnly'],
})

const mockGrouped = [{}, {}, {}, {}]
const mockGroupedRelateds = [{}, {}, {}, {}]

describe('UiArticleListFocus', () => {
  test('render the correct number', () => {
    const wrapper = createWrapper(Home, {
      data() {
        return {
          articleGrouped: {
            grouped: mockGrouped,
          },
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
