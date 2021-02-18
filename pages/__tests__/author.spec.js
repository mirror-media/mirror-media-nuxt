import page from '../author/_id.vue'
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
  test('setAuthorName', () => {
    const authorNameMock = 'name'
    const responseMock = {
      items: [
        {
          name: authorNameMock,
        },
      ],
    }

    const wrapper = createWrapper(page)
    wrapper.vm.setAuthorName(responseMock)
    expect(wrapper.vm.authorName).toBe(authorNameMock)
  })
})

describe('meta', function () {
  test('head() method in vm option should work correctly', function () {
    const authorNameMock = 'author-name-mock'
    const authorIdMock = 'author-id-mock'

    const wrapper = createWrapper(page, {
      data() {
        return {
          authorName: authorNameMock,
        }
      },
      mocks: {
        $route: {
          params: {
            id: authorIdMock,
          },
        },
      },
    })

    const head = wrapper.vm.$options.head.bind(wrapper.vm)
    const metaResults = head()

    // titles
    const titleMetas = ['og:title']
    const titleExpected = `${authorNameMock} - ${SITE_TITLE}`
    expect(metaResults.title).toBe(titleExpected)
    titleMetas.forEach(function assertion(metaName) {
      const metaObject = metaResults.meta.find((d) => d.hid === metaName)
      expect(metaObject.content).toBe(titleExpected)
    })

    // og:url
    expect(metaResults.meta.find((d) => d.hid === 'og:url').content).toBe(
      `https://www.mirrormedia.mg/author/${authorIdMock}`
    )
  })
})
