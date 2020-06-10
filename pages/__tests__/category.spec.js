import page from '../category/_name.vue'
import UIArticleList from '~/components/UIArticleList.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  mocks: {
    $route: {
      params: {
        name: '',
      },
    },
    $store: {
      state: {
        sections: {
          data: {
            items: [],
          },
        },
      },
    },
    $ua: {
      isFromPc() {
        return true
      },
    },
  },
  stubs: ['client-only', 'GPTAD'],
})

describe('stripHtmlTag method', () => {
  test('should strip html tags successfully', () => {
    const wrapper = createWrapper(page)
    const html = '<div><script></script><p>foo</p><p>bar</p><p>123</p></div>'
    expect(wrapper.vm.stripHtmlTag(html)).toBe('foobar123')
  })
  test('should return the same result if there is not html tags', () => {
    const wrapper = createWrapper(page)
    const html = 'foobar123'
    expect(wrapper.vm.stripHtmlTag(html)).toBe('foobar123')
  })
})

describe('section data', () => {
  test('should get proper section properties from store by route params', () => {
    const categoryNameMock = 'test-category-name'
    const sectionNameMock = 'test-name'
    const sectionIdMock = 'test-id'
    const sectionTitleMock = 'test-title'
    const sectionStoreMock = {
      data: {
        items: [
          {
            categories: [
              {
                name: categoryNameMock,
              },
            ],
            name: sectionNameMock,
            id: sectionIdMock,
            title: sectionTitleMock,
          },
        ],
      },
    }
    const wrapper = createWrapper(page, {
      mocks: {
        $route: {
          params: {
            name: categoryNameMock,
          },
        },
        $store: {
          state: {
            sections: sectionStoreMock,
          },
        },
      },
    })
    expect(wrapper.vm.currentSectionName).toBe(sectionNameMock)
    expect(wrapper.vm.currentSectionId).toBe(sectionIdMock)
    expect(wrapper.vm.currentSectionTitle).toBe(sectionTitleMock)
  })
})

describe('category data', () => {
  test('should get proper categories properties from store by route params', () => {
    const categoryNameMock = 'test-category-name'
    const categoryIdMock = 'test-id'
    const categoryTitleMock = 'test-title'
    const sectionStoreMock = {
      data: {
        items: [
          {
            categories: [
              {
                name: categoryNameMock,
                id: categoryIdMock,
                title: categoryTitleMock,
              },
            ],
          },
        ],
      },
    }
    const wrapper = createWrapper(page, {
      mocks: {
        $route: {
          params: {
            name: categoryNameMock,
          },
        },
        $store: {
          state: {
            sections: sectionStoreMock,
          },
        },
      },
    })
    const list = wrapper.findComponent(UIArticleList)
    expect(wrapper.vm.currentCategoryId).toBe(categoryIdMock)
    expect(list.props().listTitle).toBe(categoryTitleMock)
  })
})

describe('component methods', () => {
  test('setListData', () => {
    const categoryNameMock = 'test-category-name'
    const sectionNameMock = 'test-name'
    const sectionIdMock = 'test-id'
    const sectionTitleMock = 'test-title'
    const sectionStoreMock = {
      data: {
        items: [
          {
            categories: [
              {
                name: categoryNameMock,
              },
            ],
            name: sectionNameMock,
            id: sectionIdMock,
            title: sectionTitleMock,
          },
        ],
      },
    }

    const idMock = 'id'
    const slugMock = 'slug'
    const imageUrlMock = 'imageurl'
    const titleMock = 'title'
    const briefMock = 'brief'
    const briefHtmlMock = `<div>${briefMock}</div>`
    const responseMock = {
      items: [
        {
          name: sectionNameMock,
          id: idMock,
          slug: slugMock,
          heroImage: {
            image: {
              resizedTargets: {
                mobile: {
                  url: imageUrlMock,
                },
              },
            },
          },
          title: titleMock,
          brief: {
            html: briefHtmlMock,
          },
        },
      ],
    }

    const wrapper = createWrapper(page, {
      mocks: {
        $route: {
          params: {
            name: categoryNameMock,
          },
        },
        $store: {
          state: {
            sections: sectionStoreMock,
          },
        },
      },
    })

    wrapper.vm.setListData(responseMock)
    expect(wrapper.vm.listData).toEqual([
      {
        id: idMock,
        href: `/story/${slugMock}`,
        imgSrc: imageUrlMock,
        imgText: sectionTitleMock,
        imgTextBackgroundColor: undefined, // value from scss variable not available in jest
        infoTitle: titleMock,
        infoDescription: briefMock,
      },
    ])
  })
  test('setListDataTotal and listDataPageLimit computed by total', () => {
    const totalMock = 1234
    const responseMock = {
      meta: {
        total: totalMock,
      },
    }
    const wrapper = createWrapper(page)
    wrapper.vm.setListDataTotal(responseMock)
    expect(wrapper.vm.listDataTotal).toBe(totalMock)
    expect(wrapper.vm.listDataPageLimit).toBe(
      Math.ceil(totalMock / wrapper.vm.listDataMaxResults)
    )
  })
})
