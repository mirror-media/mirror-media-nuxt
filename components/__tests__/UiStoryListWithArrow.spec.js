import UiStoryListWithArrow from '../UiStoryListWithArrow.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  stubs: ['nuxt-link'],
})

describe('props', () => {
  test('should has proper section class', () => {
    const sectionName = 'test'
    const wrapper = createWrapper(UiStoryListWithArrow, {
      propsData: {
        sectionName,
        items: [{ slug: '' }],
      },
    })
    expect(wrapper.get('.story-list-with-arrow').classes()).toContain(
      sectionName
    )
  })
  test('should render proper href', () => {
    const slug = 'test'
    const wrapper = createWrapper(UiStoryListWithArrow, {
      propsData: {
        items: [{ slug }],
      },
    })
    expect(wrapper.get('.item').attributes().href).toBe(`/story/${slug}`)
  })
})
