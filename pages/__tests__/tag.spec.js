import page from '../tag/_id.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'
import { SITE_TITLE } from '~/constants'

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

describe('component methods', () => {
  test('setTagName', () => {
    const tagNameMock = 'name'
    const responseMock = {
      name: tagNameMock,
    }

    const wrapper = createWrapper(page)
    wrapper.vm.setTagName(responseMock)
    expect(wrapper.vm.tagName).toBe(tagNameMock)
  })
})

describe('meta', function () {
  test('head() method in vm option should work correctly', function () {
    const tagNameMock = 'tag-name-mock'
    const tagIdMock = 'tag-id-mock'

    const wrapper = createWrapper(page, {
      data() {
        return {
          tagName: tagNameMock,
        }
      },
      mocks: {
        $route: {
          params: {
            id: tagIdMock,
          },
        },
      },
    })

    const head = wrapper.vm.$options.head.bind(wrapper.vm)
    const metaResults = head()

    // titles
    const titleMetas = ['og:title', 'twitter:title']
    const titleExpected = `${tagNameMock} - ${SITE_TITLE}`
    expect(metaResults.title).toBe(titleExpected)
    titleMetas.forEach(function assertion(metaName) {
      const metaObject = metaResults.meta.find((d) => d.hid === metaName)
      expect(metaObject.content).toBe(titleExpected)
    })

    // og:url
    expect(metaResults.meta.find((d) => d.hid === 'og:url').content).toBe(
      `https://www.mirrormedia.mg/tag/${tagIdMock}`
    )
  })
})
