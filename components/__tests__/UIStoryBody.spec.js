import UIStoryBody from '../UIStoryBody.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  mocks: {
    $dayjs: jest.fn(() => ({
      format: jest.fn(),
    })),
  },
})

describe('render the proper content from props "story"', () => {
  test('title', () => {
    const titleMock = 'test'
    const wrapper = createWrapper(UIStoryBody, {
      propsData: {
        story: {
          title: titleMock,
        },
      },
    })
    const title = wrapper.get('h1')
    expect(title.text()).toBe(titleMock)
  })

  test('sections', () => {
    const sectionNameMock = 'section-name'
    const wrapper = createWrapper(UIStoryBody, {
      propsData: {
        story: {
          sections: [{ name: sectionNameMock }],
        },
      },
    })
    const categoryTitle = wrapper.get('.story__category')
    expect(categoryTitle.classes()).toContain(sectionNameMock)
  })

  test('categories', () => {
    const categoryTitleMock = 'category title'
    const wrapper = createWrapper(UIStoryBody, {
      propsData: {
        story: {
          categories: [{ title: categoryTitleMock }],
        },
      },
    })
    const categoryTitle = wrapper.get('.story__category')
    expect(categoryTitle.text()).toBe(categoryTitleMock)
  })

  test('hero image', async () => {
    const heroImageMock = 'https://image.jpg'
    const wrapper = await createWrapper(UIStoryBody, {
      propsData: {
        story: {
          heroImage: {
            image: {
              resizedTargets: {
                mobile: {
                  url: heroImageMock,
                },
              },
            },
          },
        },
      },
    })
    const image = wrapper.get('.story__hero-img img')
    expect(image.attributes().src).toBe(heroImageMock)
  })

  test('hero caption', () => {
    const herocaptionMock = 'hero caption'
    const wrapper = createWrapper(UIStoryBody, {
      propsData: {
        story: {
          heroCaption: herocaptionMock,
        },
      },
    })
    const categoryTitle = wrapper.get('.story__hero-img figcaption')
    expect(categoryTitle.text()).toBe(herocaptionMock)
  })
})
