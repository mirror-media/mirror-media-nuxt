import UiStoryListRelated from '../UiStoryListRelated.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  mocks: {
    $store: {
      getters: {
        'membership-subscribe/storyPageBaseUrl': '/story',
      },
    },
  },
})

describe('props', () => {
  test('should has proper item title and href', () => {
    const slugMock = '20200921edi011'
    const titleMock = 'test title'
    const wrapper = createWrapper(UiStoryListRelated, {
      propsData: {
        items: [{ slug: slugMock, title: titleMock }],
      },
    })
    expect(wrapper.get('.item .item__title a').text()).toBe(titleMock)
    expect(wrapper.get('.item .item__title a').attributes().href).toBe(
      `/story/${slugMock}`
    )
  })
  test('should has proper item image', () => {
    const heroImageId = '5f68169eee60acd1e1848f70'
    const slugMock = '20200921edi011'
    const imageUrlMock = 'https://www.mm.tw/test.png'
    const wrapper = createWrapper(UiStoryListRelated, {
      propsData: {
        items: [
          {
            slug: slugMock,
            title: 'test title',
            heroImage: heroImageId,
          },
        ],
        images: [
          {
            id: heroImageId,
            image: {
              resizedTargets: {
                mobile: {
                  url: imageUrlMock,
                },
              },
            },
          },
        ],
      },
    })
    expect(wrapper.get('.item .item__image').attributes().href).toBe(
      `/story/${slugMock}`
    )
    expect(wrapper.get('.item .item__image img').attributes().src).toBe(
      imageUrlMock
    )
  })
})
