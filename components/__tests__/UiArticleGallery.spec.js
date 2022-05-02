import flushPromises from 'flush-promises'

import UiArticleGallery from '../UiArticleGallery.vue'
import MicroAd from '../MicroAd.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper.js'
import { MICRO_AD_UNITS } from '~/constants/ads.js'

const createWrapper = createWrapperHelper({
  computed: {
    isDesktopWidth: () => false,
  },
  propsData: {
    items: [],
  },
})

test('display an article', async () => {
  expect.assertions(7)

  /* Arrange */
  const articleItemMock = {
    href: '/test-href/',

    // imgSrc: 'test-img-src.png',
    label: 'test label',
    title: 'test title',
    description: 'test description',
    sectionName: 'test-section-name',
  }
  const sut = createWrapper(UiArticleGallery, {
    propsData: {
      items: [articleItemMock],
    },
  })

  // for v-lazy
  await flushPromises()

  /* Assert */
  const sutText = sut.text()
  const labels = sut.findAll('.label')

  expect(sut.get('a').attributes().href).toBe(articleItemMock.href)
  expect(sut.get('img').attributes()['data-src']).toBe(articleItemMock.imgSrc)
  expect(sutText).toContain(articleItemMock.label)
  expect(sutText).toContain(articleItemMock.title)
  expect(sutText).toContain(articleItemMock.description)
  expect(labels.at(0).classes()).toContain(articleItemMock.sectionName)
  expect(labels.at(1).classes()).toContain(articleItemMock.sectionName)
})

test('display a Micro AD', () => {
  /* Arrange */
  const adItemMock = { isMicroAd: true, idx: 0 }
  const sut = createWrapper(UiArticleGallery, {
    propsData: {
      items: [adItemMock],
    },
  })

  /* Assert */
  const microAd = sut.findComponent(MicroAd)

  expect(microAd.exists()).toBe(true)
  expect(microAd.props().unitId).toBe(MICRO_AD_UNITS.HOME.MB[adItemMock.idx].id)
})

test('emit a sendGa when users click an article', () => {
  const sut = createWrapper(UiArticleGallery, {
    propsData: {
      items: [{}],
    },
  })

  sut.get('a').trigger('click')

  expect(sut.emitted().sendGa[0]).toBeTruthy()
})
