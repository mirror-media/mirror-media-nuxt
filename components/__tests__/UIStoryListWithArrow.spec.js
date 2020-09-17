import UIStoryListWithArrow from '../UIStoryListWithArrow.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  stubs: ['nuxt-link'],
})

describe('props', () => {
  test('should has proper section class', () => {
    const sectionName = 'test'
    const wrapper = createWrapper(UIStoryListWithArrow, {
      propsData: {
        sectionName,
        items: [{ slug: '' }],
      },
    })
    expect(wrapper.get('.story-list').classes()).toContain(sectionName)
  })
  test('should render proper nuxt-link to attribute', () => {
    const slug = 'test'
    const wrapper = createWrapper(UIStoryListWithArrow, {
      propsData: {
        items: [{ slug }],
      },
    })
    expect(wrapper.get('.item').attributes().to).toBe(`/story/${slug}`)
  })
})
