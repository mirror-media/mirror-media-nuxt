import Page from '../error.vue'
import UiArticleCard from '../../components/UiArticleCard.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  propsData: {
    error: {
      statusCode: 404,
    },
  },
})

describe('page information', () => {
  const wrapper = createWrapper(Page)
  test('Should have proper message', () => {
    expect(wrapper.find('h1').text()).toBe('404')
    expect(wrapper.find('h2').text()).toContain('抱歉！')
    expect(wrapper.find('h2').text()).toContain('找不到這個網址')
  })
  test('Should have link to home page', () => {
    const link = wrapper.find('a')
    expect(link.attributes().href).toBe('/')
    expect(link.text()).toBe('| 回首頁 |')
  })
})

describe('latest stories', () => {
  const mockItems = [{}]
  const wrapper = createWrapper(Page, {
    data() {
      return {
        latestStories: mockItems,
      }
    },
  })
  test('Should have proper heading', () => {
    expect(wrapper.html()).toContain('熱門文章')
  })
  test('Should have UiArticleCard', () => {
    const items = wrapper.findAllComponents(UiArticleCard)
    expect(items).toHaveLength(mockItems.length)
  })
})
