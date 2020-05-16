import page from '../section/_name.vue'
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

describe('section data', () => {
  test('should get proper section properties from store by route params', () => {
    const sectionNameMock = 'test-name'
    const sectionIdMock = 'test-id'
    const sectionTitleMock = 'test-title'
    const sectionStoreMock = {
      data: {
        items: [
          {
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
            name: sectionNameMock,
          },
        },
        $store: {
          state: {
            sections: sectionStoreMock,
          },
        },
      },
    })
    expect(wrapper.vm.currentSectionId).toBe(sectionIdMock)
    expect(wrapper.vm.currentSectionTitle).toBe(sectionTitleMock)
  })
})
