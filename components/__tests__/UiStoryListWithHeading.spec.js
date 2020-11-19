import UiStoryListWithHeading from '../UiStoryListWithHeading.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  propsData: {
    heading: '',
    items: [{}],
  },
})

describe('props', () => {
  test('display the heading', () => {
    /* Arrange */
    const headingMock = 'test heading'
    const sut = createWrapper(UiStoryListWithHeading, {
      propsData: {
        heading: headingMock,
      },
    })

    /* Assert */
    expect(sut.get('.heading').text()).toBe(headingMock)
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

  test('display the list item', () => {
    /* Arrange */
    const titleMock = 'test title'
    const mobileImgUrlMock = 'https://www.mm.tw/mobile.jpg'
    const sectionNameMock = 'news'
    const sut = createWrapper(UiStoryListWithHeading, {
      propsData: {
        items: [
          {
            heroImage: {
              image: {
                resizedTargets: {
                  mobile: { url: mobileImgUrlMock },
                },
              },
            },
            sections: [{ name: sectionNameMock }],
            title: titleMock,
          },
        ],
      },
    })

    /* Assert */
    expect(sut.get('.item').classes()).toContain(sectionNameMock)
    expect(sut.get('.item__image img').attributes().src).toBe(mobileImgUrlMock)
    expect(sut.get('.item__title').text()).toBe(titleMock)
  })

  test('display the section title', async () => {
    expect.assertions(4)

    /* Arrange */
    const sectionTitleMock = '娛樂'
    const categoryTitleMock = '鏡大咖'
    const sut = createWrapper(UiStoryListWithHeading, {
      propsData: {
        items: [
          {
            sections: [{ title: sectionTitleMock }],
            categories: [{ title: categoryTitleMock }],
          },
        ],
      },
    })
    const imgSection = sut.get('.item__image .item__section')
    const titleSection = sut.get('.item__section-title .item__section')

    /* Assert */
    expect(imgSection.text()).toBe(sectionTitleMock)
    expect(titleSection.text()).toBe(sectionTitleMock)

    /* Act */
    await sut.setProps({ extractTitle: (item) => item.categories[0].title })

    /* Assert */
    expect(imgSection.text()).toBe(categoryTitleMock)
    expect(titleSection.text()).toBe(categoryTitleMock)
  })
})
