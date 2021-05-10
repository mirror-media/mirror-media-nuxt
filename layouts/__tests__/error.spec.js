import Page from '../error.vue'
import UiArticleCard from '../../components/UiArticleCard.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  propsData: {
    error: {},
  },
})

describe('page information with default empty error settings', () => {
  const wrapper = createWrapper(Page)
  test('Should provide info of 500 by default', () => {
    expect(wrapper.find('h1').text()).toBe('500')
    expect(wrapper.find('h2').text()).toEqual('抱歉！系統忙碌中')
  })
  test('Should provide info of 500 if message of error settings is "error"', () => {
    const wrapper = createWrapper(Page, {
      propsData: {
        error: {
          message: 'error',
        },
      },
    })
    expect(wrapper.find('h1').text()).toBe('500')
    expect(wrapper.find('h2').text()).toEqual('抱歉！系統忙碌中')
  })
  test('Should provide info of 404 if message of error settings is "not found"', () => {
    const wrapper = createWrapper(Page, {
      propsData: {
        error: {
          message: 'not found',
        },
      },
    })
    expect(wrapper.find('h1').text()).toBe('404')
    expect(wrapper.find('h2').text()).toEqual('抱歉！找不到這個網址')
  })
})

test('Should have link to home page', () => {
  const wrapper = createWrapper(Page)
  const link = wrapper.find('a')
  expect(link.attributes().href).toBe('/')
  expect(link.text()).toBe('| 回首頁 |')
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
