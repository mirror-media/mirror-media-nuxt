import CulturePost from '../ContainerCulturePost.vue'
import UiArticleIndex from '../UiArticleIndex.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper.js'

const createWrapper = createWrapperHelper({
  propsData: {
    story: {},
  },
  mocks: {
    $store: {
      getters: {
        'viewport/isViewportWidthUpXl': false,
      },
    },
  },
})

describe('article index', () => {
  test('do not show the article index if the post does not have any first-level headings', () => {
    const sut = createWrapper(CulturePost)

    expect(sut.findComponent(UiArticleIndex).exists()).toBe(false)
  })
})
