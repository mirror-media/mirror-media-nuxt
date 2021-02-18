import page from '../section/topic.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'
import { SITE_TITLE } from '~/constants'

const createWrapper = createWrapperHelper()

describe('meta', function () {
  test('head() method in vm option should work correctly', function () {
    const wrapper = createWrapper(page)

    const head = wrapper.vm.$options.head.bind(wrapper.vm)
    const metaResults = head()

    // titles
    const titleMetas = ['og:title']
    const titleExpected = `Topic - ${SITE_TITLE}`
    expect(metaResults.title).toBe(titleExpected)
    titleMetas.forEach(function assertion(metaName) {
      const metaObject = metaResults.meta.find((d) => d.hid === metaName)
      expect(metaObject.content).toBe(titleExpected)
    })

    // og:url
    expect(metaResults.meta.find((d) => d.hid === 'og:url').content).toBe(
      'https://www.mirrormedia.mg/section/topic'
    )

    // section-name
    expect(metaResults.meta.find((d) => d.hid === 'section-name').content).toBe(
      'other'
    )
  })
})
