import CulturePost from '../culture-post/_slug.vue'
import UiCulturePostIndex from '~/components/UiCulturePostIndex.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper.js'

const createWrapper = createWrapperHelper({
  data() {
    return {
      post: {
        content: [],
      },
    }
  },
})

describe('article index', () => {
  test('do not show the article index if the post does not have any first-level headings', () => {
    const sut = createWrapper(CulturePost)

    expect(sut.findComponent(UiCulturePostIndex).exists()).toBe(false)
  })
})
