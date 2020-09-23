import UIStoryListWithHeading from '../UIStoryListWithHeading.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper()

describe('props', () => {
  test('should render proper heading', () => {
    const headingMock = 'test heading'
    const wrapper = createWrapper(UIStoryListWithHeading, {
      propsData: {
        heading: headingMock,
        items: [{}],
      },
    })
    expect(wrapper.get('.story-list__heading').text()).toBe(headingMock)
  })
  test('should render proper item', () => {
    const slugMock = '/story/test-slug/'
    const titleMock = 'test title'
    const mobileImageUrlMock = 'https://www.mm.tw/mobile.jpg'
    const tinyImageUrlMock = 'https://www.mm.tw/tiny.jpg'
    const sectionNameMock = 'news'
    const sectionTitleMock = 'section title'
    const wrapper = createWrapper(UIStoryListWithHeading, {
      propsData: {
        items: [
          {
            heroImage: {
              image: {
                resizedTargets: {
                  mobile: {
                    url: mobileImageUrlMock,
                  },
                  tiny: {
                    url: tinyImageUrlMock,
                  },
                },
              },
            },
            sections: [
              {
                name: sectionNameMock,
                title: sectionTitleMock,
              },
            ],
            slug: slugMock,
            title: titleMock,
          },
        ],
      },
    })
    expect(wrapper.get('.item').classes()).toContain(sectionNameMock)
    expect(wrapper.get('.item__image').attributes().href).toBe(slugMock)
    expect(wrapper.get('.item__image img').attributes().src).toBe(
      tinyImageUrlMock
    )
    expect(wrapper.get('.item__image img').attributes().srcset).toBe(
      `${tinyImageUrlMock} 1x, ${mobileImageUrlMock} 2x`
    )
    expect(wrapper.get('.item__image .item__section').text()).toBe(
      sectionTitleMock
    )
    expect(wrapper.get('.item__section-title .item__section').text()).toBe(
      sectionTitleMock
    )
    expect(wrapper.get('.item__title').attributes().href).toBe(slugMock)
    expect(wrapper.get('.item__title').text()).toBe(titleMock)
  })
})
