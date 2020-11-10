import page from '../index.vue'
import UiArticleListFocus from '~/components/UiArticleListFocus.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper()

const mockGrouped = [{}, {}, {}, {}]
const mockGroupedRelateds = [{}, {}, {}, {}]

describe('UiArticleListFocus', () => {
  test('render the correct number', () => {
    const wrapper = createWrapper(page, {
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
    const wrapper = createWrapper(page, {
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
