import page from '../search/_keyword.vue'
import UIArticleList from '~/components/UIArticleList.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  mocks: {
    $route: {
      params: {
        keyword: '',
      },
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
  stubs: ['client-only'],
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

describe('page title', () => {
  test('should affect by search keyword provided from route params', () => {
    const keywordMock = 'i am keyword'
    const wrapper = createWrapper(page, {
      mocks: {
        $route: {
          params: {
            keyword: keywordMock,
          },
        },
      },
    })
    const title = wrapper.get('h1')
    expect(title.text()).toBe(keywordMock)
  })
})

describe('section data', () => {
  test('should get proper section title by section id provided by url query', () => {
    const sectionIdMock = 'test-id'
    const sectionTitleMock = 'test-title'
    const sectionStoreMock = {
      data: {
        items: [
          {
            id: sectionIdMock,
            title: sectionTitleMock,
          },
        ],
      },
    }
    const wrapper = createWrapper(page, {
      mocks: {
        $route: {
          query: {
            section: sectionIdMock,
          },
        },
        $store: {
          state: {
            sections: sectionStoreMock,
          },
        },
      },
    })
    expect(wrapper.vm.sectionQueryTitle).toBe(sectionTitleMock)
  })

  /*
   * test('section title should be null if section query in url not exist', () => {
   *   const wrapper = createWrapper(page)
   *   expect(wrapper.vm.sectionQueryTitle).toBe(null)
   * })
   */
  test('section title should be null if section id cannot be found in section store', () => {
    const sectionIdMock = 'test-id'
    const sectionTitleMock = 'test-title'
    const sectionStoreMock = {
      data: {
        items: [
          {
            id: sectionIdMock,
            title: sectionTitleMock,
          },
        ],
      },
    }
    const wrapper = createWrapper(page, {
      mocks: {
        $route: {
          query: {
            section: 'id-not-exist-in-section-store',
          },
        },
        $store: {
          state: {
            sections: sectionStoreMock,
          },
        },
      },
    })
    expect(wrapper.vm.sectionQueryTitle).toBe(null)
  })
})

describe('fetchSearchListing query object', () => {
  test('should contain section property if url has section query', () => {
    const keywordMock = 'keyword'
    const sectionIdMock = 'test-id'
    const sectionTitleMock = 'test-title'
    const $fetchSearch = jest.fn(() => Promise.resolve())
    const wrapper = createWrapper(page, {
      mocks: {
        $route: {
          params: {
            keyword: keywordMock,
          },
          query: {
            section: sectionIdMock,
          },
        },
        $store: {
          state: {
            sections: {
              data: {
                items: [
                  {
                    id: sectionIdMock,
                    title: sectionTitleMock,
                  },
                ],
              },
            },
          },
        },
        $fetchSearch,
      },
    })

    wrapper.vm.fetchSearchListing()
    expect($fetchSearch).toBeCalledWith({
      maxResults: 9,
      keywords: keywordMock,
      section: sectionTitleMock, // this property should exist
      page: 1,
    })
  })
  test('should not contain section property if url do not has section query', () => {
    const keywordMock = 'keyword'
    const $fetchSearch = jest.fn(() => Promise.resolve())
    const wrapper = createWrapper(page, {
      mocks: {
        $route: {
          params: {
            keyword: keywordMock,
          },
          query: {},
        },
        $fetchSearch,
      },
    })

    wrapper.vm.fetchSearchListing()
    expect($fetchSearch).toBeCalledWith({
      maxResults: 9,
      keywords: keywordMock,
      page: 1,
    })
  })
})

describe('component methods', () => {
  test('setListData', async () => {
    expect.assertions(1)

    const idMock = 'id'
    const slugMock = 'slug'
    const imageUrlMock = 'imageurl'
    const titleMock = 'title'
    const briefMock = 'brief'
    const briefHtmlMock = `<div>${briefMock}</div>`
    const sectionTitleMock = 'section-title'
    const responseMock = {
      hits: {
        hits: [
          {
            source: {
              objectID: idMock,
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
              brief: briefHtmlMock,
              sections: [
                {
                  title: sectionTitleMock,
                },
              ],
            },
          },
        ],
      },
    }

    const wrapper = createWrapper(page)
    wrapper.vm.setListData(responseMock)
    await wrapper.vm.$nextTick()
    const list = wrapper.findComponent(UIArticleList)
    expect(list.props().listData).toEqual([
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
      hits: {
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

describe('loadmore button', () => {
  test('hide loadmore button if listData is empty', () => {
    const wrapper = createWrapper(page)
    wrapper.setData({
      listDataTotal: 0,
    })
    const button = wrapper.find('.section__loadmore-button')
    expect(button.exists()).toBe(false)
  })
  test('hide loadmore button if listData reach its page limit', () => {
    const wrapper = createWrapper(page)
    wrapper.setData({
      listDataMaxResults: 9,
      listDataTotal: 9,
      listDataCurrentPage: 1, // listDataPageLimit will be 1(calculate by lsitDataMaxResults and listDataTotal)
    })
    const button = wrapper.find('.section__loadmore-button')
    expect(button.exists()).toBe(false)
  })
})
