import { shallowMount } from '@vue/test-utils'
import UIArticleList from '../UIArticleList.vue'
import UIArticleCard from '../UIArticleCard.vue'

describe('list title', () => {
  test('should render proper title from "listTitle" props', () => {
    const listTitle = 'test title'
    const wrapper = shallowMount(UIArticleList, {
      propsData: {
        listTitle,
      },
    })
    const h1 = wrapper.find('h1')
    expect(h1.text()).toBe(listTitle)
  })
  test('should render proper color from props "listTitleColor"', () => {
    const listTitleColor = '#000000' // rgb(0, 0, 0)
    const wrapper = shallowMount(UIArticleList, {
      propsData: {
        listTitle: 'test title',
        listTitleColor,
      },
    })
    const h1 = wrapper.find('h1')
    expect(h1.element.style.color).toBe('rgb(0, 0, 0)')
  })
  test('do not render title if "listTitle" props is empty string', () => {
    const listTitle = ''
    const wrapper = shallowMount(UIArticleList, {
      propsData: {
        listTitle,
      },
    })
    const h1 = wrapper.find('h1')
    expect(h1.exists()).toBe(false)
  })
})

describe('render list items', () => {
  test('should render proper number of UIArticleCard that we provide from "listData" props', () => {
    const listData = [{}, {}]
    const wrapper = shallowMount(UIArticleList, {
      propsData: {
        listData,
      },
    })
    const articles = wrapper.findAll(UIArticleCard)
    expect(articles).toHaveLength(listData.length)
  })
  test('should deliver proper props to UIArticleCard that we provide from "listData" props', () => {
    const listData = [
      {
        href: '/',
        imgSrc: 'test imgSrc',
        imgText: 'test imgText',
        imgTextBackgroundColor: 'test imgTextBackgroundColor',
        infoTitle: 'test infoTitle',
        infoDescription: 'test infoDescription',
      },
    ]
    const wrapper = shallowMount(UIArticleList, {
      propsData: {
        listData,
      },
    })
    const article = wrapper.find(UIArticleCard)
    const listItemMock = listData[0]
    Object.entries(listItemMock).forEach((tuple) => {
      const key = tuple[0]
      const value = tuple[1]
      expect(article.props()[key]).toBe(value)
    })
  })
  test('do not render list if "listData" props is empty array', () => {
    const listData = []
    const wrapper = shallowMount(UIArticleList, {
      propsData: {
        listData,
      },
    })
    const list = wrapper.find('ol')
    expect(list.exists()).toBe(false)
  })
})
