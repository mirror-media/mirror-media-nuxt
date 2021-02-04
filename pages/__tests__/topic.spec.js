import { mount, createLocalVue } from '@vue/test-utils'
import { directive as swiper } from 'vue-awesome-swiper'
import flushPromises from 'flush-promises'

import page from '../topic/_id.vue'
import UiArticleList from '~/components/UiArticleList.vue'
import UiWineWarning from '~/components/UiWineWarning.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  data() {
    return {
      topic: {
        leading: 'slideshow',
      },
    }
  },
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

test('display a slideshow', async function () {
  expect.assertions(5)

  /* Arrange */
  const localVue = createLocalVue()
  localVue.directive('swiper', swiper)

  const sut = mount(page, {
    localVue,
    data() {
      return {
        topic: {
          leading: 'slideshow',
        },
      }
    },
    mocks: {
      $route: {
        params: { id: 'testid' },
      },
    },
    stubs: ['SvgArrowPrev', 'SvgArrowNext'],
  })

  /* Act */
  const imgItemMock = {
    id: 'test-id',
    image: {
      resizedTargets: {
        mobile: { url: 'test-img-mobile.png' },
        tablet: { url: 'test-img-tablet.png' },
        desktop: { url: 'test-img-desktop.png' },
      },
    },
    description: 'test-description',
    keywords: '@-/test-href',
  }
  sut.vm.setTopicImgsItems({
    items: [imgItemMock],
  })
  await flushPromises()

  /* Assert */
  const slideshow = sut.get('[data-testid="slideshow"]')
  const pictureSources = slideshow.findAll('source')
  const slideImg = slideshow.get('img')
  const {
    keywords,
    image: {
      resizedTargets: { mobile, tablet, desktop },
    },
    description,
  } = imgItemMock

  expect(slideshow.get('a').attributes().href).toBe(keywords.slice(2))
  expect(pictureSources.at(0).attributes().srcset).toBe(desktop.url)
  expect(pictureSources.at(1).attributes().srcset).toBe(tablet.url)
  expect(slideImg.attributes().src).toBe(mobile.url)
  expect(slideImg.attributes().alt).toBe(description)
})

describe('component methods', () => {
  test('setListItems', async () => {
    expect.assertions(1)

    const idMock = 'id'
    const slugMock = 'slug'
    const imageUrlMock = 'imageurl'
    const titleMock = 'title'
    const briefMock = 'brief'
    const briefHtmlMock = `<div>${briefMock}</div>`
    const sectionTitleMock = 'section-title'
    const responseMock = {
      items: [
        {
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
          sections: [
            {
              title: sectionTitleMock,
            },
          ],
        },
      ],
    }

    const wrapper = createWrapper(page)
    wrapper.vm.setListItems(responseMock)
    await wrapper.vm.$nextTick()
    const list = wrapper.findComponent(UiArticleList)
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
})

describe('wine warning', () => {
  const TOPIC_IDS_WINE = [
    '5c25f9e3315ec51000903a82',
    '5d22bb9fe311f3925c49396c',
    '5a4d8e60160ac91000294611',
  ]

  TOPIC_IDS_WINE.forEach((id) => {
    test(`show the wine warning when the topic id is ${id}`, () => {
      const sut = createWrapper(page, {
        mocks: {
          $route: {
            params: { id },
          },
        },
      })

      expect(sut.findComponent(UiWineWarning).exists()).toBe(true)
    })
  })
})
