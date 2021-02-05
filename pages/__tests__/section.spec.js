import page from '../section/_name.vue'
import UiArticleList from '~/components/UiArticleList.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'
import { SITE_TITLE, SITE_DESCRIPTION } from '~/constants'

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
    const list = wrapper.findComponent(UiArticleList)
    expect(wrapper.vm.currentSectionId).toBe(sectionIdMock)
    expect(list.props().listTitle).toBe(sectionTitleMock)
  })
})

describe('meta', function () {
  test('head() method in vm option should work correctly', function () {
    const sectionNameMock = 'test-name'
    const sectionIdMock = 'test-id'
    const sectionTitleMock = 'test-title'
    const sectionDescriptionMock = 'test-description'
    const sectionStoreMock = {
      data: {
        items: [
          {
            name: sectionNameMock,
            id: sectionIdMock,
            title: sectionTitleMock,
            description: sectionDescriptionMock,
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
    const head = wrapper.vm.$options.head.bind(wrapper.vm)
    const metaResults = head()

    // titles
    const titleMetas = ['og:title', 'twitter:title']
    const titleExpected = `${sectionTitleMock} - ${SITE_TITLE}`
    expect(metaResults.title).toBe(titleExpected)
    titleMetas.forEach(function assertion(metaName) {
      const metaObject = metaResults.meta.find((d) => d.hid === metaName)
      expect(metaObject.content).toBe(titleExpected)
    })

    // descriptions
    const descriptionMetas = [
      'description',
      'og:description',
      'twitter:description',
    ]
    descriptionMetas.forEach(function assertion(metaName) {
      const metaObject = metaResults.meta.find((d) => d.hid === metaName)
      expect(metaObject.content).toBe(sectionDescriptionMock)
    })

    // og:url
    expect(metaResults.meta.find((d) => d.hid === 'og:url').content).toBe(
      `https://www.mirrormedia.mg/section/${sectionNameMock}`
    )

    // section-name
    expect(metaResults.meta.find((d) => d.hid === 'section-name').content).toBe(
      sectionNameMock
    )
  })

  test('description should be the default value if description in section store is empty', function () {
    const sectionStoreMock = {
      data: {
        items: [
          {
            name: 'test-name',
            id: 'test-id',
            title: 'test-title',
            description: '',
          },
        ],
      },
    }
    const wrapper = createWrapper(page, {
      mocks: {
        $route: {
          params: {
            name: 'test-name',
          },
        },
        $store: {
          state: {
            sections: sectionStoreMock,
          },
        },
      },
    })
    const head = wrapper.vm.$options.head.bind(wrapper.vm)
    const metaResults = head()

    // descriptions
    const descriptionMetas = [
      'description',
      'og:description',
      'twitter:description',
    ]
    descriptionMetas.forEach(function assertion(metaName) {
      const metaObject = metaResults.meta.find((d) => d.hid === metaName)
      expect(metaObject.content).toBe(SITE_DESCRIPTION)
    })
  })
})
