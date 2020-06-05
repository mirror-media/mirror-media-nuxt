import page from '../index.vue'
import UIArticleListFocus from '~/components/UIArticleListFocus.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper()

const mockGrouped = [{}, {}, {}, {}]
const mockGroupedRelateds = [{}, {}, {}, {}]

describe('UIArticleListFocus', () => {
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

    const focusArticleLists = wrapper.findAllComponents(UIArticleListFocus)
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

    const focusArticleList = wrapper.findComponent(UIArticleListFocus)
    expect(focusArticleList.props().articlesRelated).toHaveLength(
      mockGroupedRelateds.length - 1
    )
  })
})
