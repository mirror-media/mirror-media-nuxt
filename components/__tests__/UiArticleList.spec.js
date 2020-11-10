import { shallowMount } from '@vue/test-utils'
import _ from 'lodash'
import UiArticleList from '../UiArticleList.vue'
import UiArticleCard from '../UiArticleCard.vue'

describe('list title', () => {
  test('should render proper title from "listTitle" props', () => {
    const listTitle = 'test title'
    const wrapper = shallowMount(UiArticleList, {
      propsData: {
        listTitle,
        listData: [],
      },
    })
    const h1 = wrapper.get('h1')
    expect(h1.text()).toBe(listTitle)
  })
  test('should render proper color from props "listTitleColor"', () => {
    const listTitleColor = '#000000' // rgb(0, 0, 0)
    const wrapper = shallowMount(UiArticleList, {
      propsData: {
        listTitle: 'test title',
        listTitleColor,
        listData: [],
      },
    })
    const h1 = wrapper.get('h1')
    expect(h1.element.style.color).toBe('rgb(0, 0, 0)')
  })
  test('do not render title if "listTitle" props is empty string', () => {
    const listTitle = ''
    const wrapper = shallowMount(UiArticleList, {
      propsData: {
        listTitle,
        listData: [],
      },
    })
    const h1 = wrapper.find('h1')
    expect(h1.exists()).toBe(false)
  })
})

describe('render list items', () => {
  test('should render proper number of UiArticleCard that we provide from "listData" props', () => {
    const listData = [{}, {}]
    const wrapper = shallowMount(UiArticleList, {
      propsData: {
        listData,
      },
    })
    const articles = wrapper.findAllComponents(UiArticleCard)
    expect(articles).toHaveLength(listData.length)
  })
  test('should deliver proper props to UiArticleCard that we provide from "listData" props', () => {
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
    const wrapper = shallowMount(UiArticleList, {
      propsData: {
        listData,
      },
    })
    const article = wrapper.findComponent(UiArticleCard)
    const listItemMock = listData[0]
    Object.entries(listItemMock).forEach((tuple) => {
      const key = tuple[0]
      const value = tuple[1]
      expect(article.props()[key]).toBe(value)
    })
  })
  test('do not render list if "listData" props is empty array', () => {
    const listData = []
    const wrapper = shallowMount(UiArticleList, {
      propsData: {
        listData,
      },
    })
    const list = wrapper.find('ol')
    expect(list.exists()).toBe(false)
  })
})

describe('MicroAd slot', function () {
  test('Should not render list item of MicroAd if there are non of any slots exist', function () {
    const listData = _.fill(Array(9), [
      {
        href: '/',
        imgSrc: 'test imgSrc',
        imgText: 'test imgText',
        imgTextBackgroundColor: 'test imgTextBackgroundColor',
        infoTitle: 'test infoTitle',
        infoDescription: 'test infoDescription',
      },
    ])
    const wrapper = shallowMount(UiArticleList, {
      propsData: {
        listData,
      },
      slots: {
        RANDOM_SLOT_NAME_NO_MATCH_ANY_MICROAD: { template: '<div></div>' },
      },
    })
    const listItemAds = wrapper.findAll('.list__list-item--ad')
    expect(listItemAds).toHaveLength(0)
  })
  test('Should render list item of MicroAd if we use UiArticleList with MicroAd slot', function () {
    const listData = _.fill(Array(9), [
      {
        href: '/',
        imgSrc: 'test imgSrc',
        imgText: 'test imgText',
        imgTextBackgroundColor: 'test imgTextBackgroundColor',
        infoTitle: 'test infoTitle',
        infoDescription: 'test infoDescription',
      },
    ])
    const wrapper = shallowMount(UiArticleList, {
      propsData: {
        listData,
      },
      slots: {
        NA1_RWD_SP: '<div id="na1-rwd-sp" />',
        NA2_RWD_SP: '<div id="na2-rwd-sp" />',
        NA3_RWD_SP: '<div id="na3-rwd-sp" />',
      },
    })

    const listItems = wrapper.findAll('.list__list-item')
    expect(listItems).toHaveLength(9 + 3)
    expect(listItems.at(2).classes()).toContain('list__list-item--ad')
    expect(listItems.at(2).find('#na1-rwd-sp').exists()).toBe(true)
    expect(listItems.at(4).classes()).toContain('list__list-item--ad')
    expect(listItems.at(4).find('#na2-rwd-sp').exists()).toBe(true)
    expect(listItems.at(8).classes()).toContain('list__list-item--ad')
    expect(listItems.at(8).find('#na3-rwd-sp').exists()).toBe(true)

    const listItemAds = wrapper.findAll('.list__list-item--ad')
    expect(listItemAds).toHaveLength(3)
  })
})
