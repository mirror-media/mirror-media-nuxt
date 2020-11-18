import CulturePost from '../ContainerCulturePost.vue'
import UiCulturePostIndex from '../UiCulturePostIndex.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper.js'

const createWrapper = createWrapperHelper({
  propsData: {
    story: {
      brief: { apiData: [] },
    },
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

    expect(sut.findComponent(UiCulturePostIndex).exists()).toBe(false)
  })
})
