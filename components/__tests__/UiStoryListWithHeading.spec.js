import UiStoryListWithHeading from '../UiStoryListWithHeading.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  propsData: {
    heading: '',
    items: [{}],
  },
})

describe('props', () => {
  test('render proper heading', () => {
    const headingMock = 'test heading'
    const wrapper = createWrapper(UiStoryListWithHeading, {
      propsData: {
        heading: headingMock,
      },
    })
    expect(wrapper.get('.heading').text()).toBe(headingMock)
  })

  test('render the href', async () => {
    expect.assertions(4)

    /* Arrange */
    const slugNormalMock = 'slug-normal'
    const sut = createWrapper(UiStoryListWithHeading, {
      propsData: {
        items: [{ slug: slugNormalMock }],
      },
    })

    /* Assert */
    expect(sut.get('.item__image').attributes().href).toBe(
      `/story/${slugNormalMock}/`
    )
    expect(sut.get('.item__title').attributes().href).toBe(
      `/story/${slugNormalMock}/`
    )

    /* Act */
    const slugStoryMock = '/story/slug/'
    sut.setProps({ items: [{ slug: slugStoryMock }] })

    await sut.vm.$nextTick()

    /* Assert */
    expect(sut.get('.item__image').attributes().href).toBe(slugStoryMock)
    expect(sut.get('.item__title').attributes().href).toBe(slugStoryMock)
  })

  test('render proper item', () => {
    const titleMock = 'test title'
    const mobileImageUrlMock = 'https://www.mm.tw/mobile.jpg'
    const sectionNameMock = 'news'
    const sectionTitleMock = 'section title'
    const wrapper = createWrapper(UiStoryListWithHeading, {
      propsData: {
        items: [
          {
            heroImage: {
              image: {
                resizedTargets: {
                  mobile: {
                    url: mobileImageUrlMock,
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
            title: titleMock,
          },
        ],
      },
    })

    expect(wrapper.get('.item').classes()).toContain(sectionNameMock)
    expect(wrapper.get('.item__image img').attributes().src).toBe(
      mobileImageUrlMock
    )
    expect(wrapper.get('.item__image .item__section').text()).toBe(
      sectionTitleMock
    )
    expect(wrapper.get('.item__section-title .item__section').text()).toBe(
      sectionTitleMock
    )
    expect(wrapper.get('.item__title').text()).toBe(titleMock)
  })

  test('render proper title', async () => {
    const mockSectionTitle = '娛樂'
    const mockCategoryTitle = '鏡大咖'
    const wrapper = createWrapper(UiStoryListWithHeading, {
      propsData: {
        items: [
          {
            sections: [{ title: mockSectionTitle }],
            categories: [{ title: mockCategoryTitle }],
          },
        ],
      },
    })
    const imgSection = wrapper.get('.item__image .item__section')
    const titleSection = wrapper.get('.item__section-title .item__section')

    expect(imgSection.text()).toBe(mockSectionTitle)
    expect(titleSection.text()).toBe(mockSectionTitle)

    await wrapper.setProps({ extractTitle: (item) => item.categories[0].title })

    expect(imgSection.text()).toBe(mockCategoryTitle)
    expect(titleSection.text()).toBe(mockCategoryTitle)
  })
})
