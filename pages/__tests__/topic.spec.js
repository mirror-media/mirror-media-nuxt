import page from '../topic/_id.vue'
import UiArticleList from '~/components/UiArticleList.vue'
import UiWineWarning from '~/components/UiWineWarning.vue'

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
    wrapper.vm.setListData(responseMock)
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
  test('setListDataTotal and listDataPageLimit computed by total', () => {
    const totalMock = 1234
    const responseMock = {
      meta: {
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
