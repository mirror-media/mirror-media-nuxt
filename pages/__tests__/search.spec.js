import page from '../search/_keyword.vue'
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
    expect(wrapper.vm.sectionTitle).toBe(sectionTitleMock)
  })

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
    expect(wrapper.vm.sectionTitle).toBeNull()
  })
})
