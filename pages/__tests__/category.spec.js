import page from '../category/_name.vue'
import UiWineWarning from '~/components/UiWineWarning.vue'
import UiStickyAd from '~/components/UiStickyAd.vue'
import ContainerFullScreenAds from '~/components/ContainerFullScreenAds.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'
import { SITE_TITLE } from '~/constants'

const createWrapper = createWrapperHelper({
  computed: {
    getSectionByCategoryName: () => () => ({
      categories: [],
    }),
  },
  mocks: {
    $route: {
      params: {
        name: '',
      },
    },
  },
})

describe('section data', () => {
  test('should get proper section properties from store by route params', () => {
    const categoryNameMock = 'test-category-name'
    const sectionNameMock = 'test-name'
    const sectionIdMock = 'test-id'
    const sectionTitleMock = 'test-title'
    const sectionDataMock = {
      categories: [
        {
          name: categoryNameMock,
        },
      ],
      id: sectionIdMock,
      name: sectionNameMock,
      title: sectionTitleMock,
    }
    const wrapper = createWrapper(page, {
      computed: {
        getSectionByCategoryName: () => () => sectionDataMock,
      },
      mocks: {
        $route: {
          params: {
            name: categoryNameMock,
          },
        },
      },
    })

    expect(wrapper.vm.sectionName).toBe(sectionNameMock)
    expect(wrapper.vm.sectionId).toBe(sectionIdMock)
    expect(wrapper.vm.sectionTitle).toBe(sectionTitleMock)
  })
})

describe('meta', function () {
  test('head() method in vm option should work correctly', function () {
    const categoryNameMock = 'test-category-name'
    const categoryTitleMock = 'test-title-name'
    const sectionNameMock = 'test-name'
    const sectionIdMock = 'test-id'
    const sectionTitleMock = 'test-title'
    const sectionDataMock = {
      categories: [
        {
          name: categoryNameMock,
          title: categoryTitleMock,
        },
      ],
      id: sectionIdMock,
      name: sectionNameMock,
      title: sectionTitleMock,
    }

    const wrapper = createWrapper(page, {
      computed: {
        getSectionByCategoryName: () => () => sectionDataMock,
      },
      mocks: {
        $route: {
          params: {
            name: categoryNameMock,
          },
        },
      },
    })

    const head = wrapper.vm.$options.head.bind(wrapper.vm)
    const metaResults = head()

    // titles
    const titleMetas = ['og:title', 'twitter:title']
    const titleExpected = `${categoryTitleMock} - ${SITE_TITLE}`
    expect(metaResults.title).toBe(titleExpected)
    titleMetas.forEach(function assertion(metaName) {
      const metaObject = metaResults.meta.find((d) => d.hid === metaName)
      expect(metaObject.content).toBe(titleExpected)
    })

    // og:url
    expect(metaResults.meta.find((d) => d.hid === 'og:url').content).toBe(
      `https://www.mirrormedia.mg/category/${categoryNameMock}`
    )

    // section-name
    expect(metaResults.meta.find((d) => d.hid === 'section-name').content).toBe(
      sectionNameMock
    )
  })
})

describe('wine warning', () => {
  test('show the wine warning when the category name is wine', () => {
    testWineCatogoryPage((sut) => {
      expect(sut.findComponent(UiWineWarning).exists()).toBe(true)
    })
  })

  test('do not show ADs of MB_ST, MB_FS, MB_AD2 & MB_INNITY when the category name is wine', () => {
    testWineCatogoryPage((sut) => {
      // MB_ST
      expect(sut.findComponent(UiStickyAd).exists()).toBe(false)

      // MB_FS, MB_AD2 & MB_INNITY
      expect(sut.findComponent(ContainerFullScreenAds).exists()).toBe(false)
    })
  })

  function testWineCatogoryPage(assert) {
    const sut = createWrapper(page, {
      mocks: {
        $route: {
          params: { name: 'wine' },
        },
      },
    })

    assert(sut)
  }
})
