import dayjs from 'dayjs'

import UIStoryBody from '../UIStoryBody.vue'
import UIShareSidebox from '../UIShareSidebox.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  propsData: {
    story: {},
  },
  mocks: {
    $dayjs: dayjs,
    $nuxt: {
      context: {
        store: { getters: {} },
      },
    },
  },
  stubs: ['ClientOnly'],
})

describe('render the proper content from props "story"', () => {
  test('published date', () => {
    const publishedDate = 'Mon, 14 Sep 2020 08:29:45 GMT'
    const wrapper = createWrapper(UIStoryBody, {
      propsData: {
        story: {
          publishedDate,
        },
      },
    })
    expect(wrapper.get('.story__published-date').text()).toBe(
      dayjs(publishedDate).format('YYYY.MM.DD HH:mm')
    )
  })

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
          categories: [{ title: 'category' }],
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

  test('credit', () => {
    const wrapper = createWrapper(UIStoryBody, {
      propsData: {
        story: {
          writers: [{ id: '123', name: 'Tom' }],
          photographers: [{ id: '456', name: 'Mary' }],
          designers: [{ id: '789', name: 'Tony' }],
          engineers: [{ id: '987', name: 'Andy' }],
          cameraMan: [{ id: '654', name: 'Allen' }],
          extendByline: '聲音｜黃宗潔',
        },
      },
    })

    expect(wrapper.get('.story__credit').element).toMatchSnapshot()
  })

  test('not render credit when no authors', () => {
    const wrapper = createWrapper(UIStoryBody, {
      propsData: {
        story: {
          writers: [],
          photographers: [],
          designers: [],
          engineers: [],
          cameraMan: [],
          extendByline: '',
        },
      },
    })

    expect(wrapper.find('.story__credit').exists()).toBe(false)
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

  test('updated-at should be rendered', () => {
    const updatedAt = 'Mon, 14 Sep 2020 08:29:45 GMT'
    const wrapper = createWrapper(UIStoryBody, {
      propsData: {
        story: {
          updatedAt,
        },
      },
    })
    expect(wrapper.get('.story__updated-at').text()).toBe(
      `更新時間｜${dayjs(updatedAt).format('YYYY.MM.DD HH:mm')}`
    )
  })

  test('updated-at should not be rendered', () => {
    const datetime = 'Mon, 14 Sep 2020 08:29:45 GMT'
    const wrapper = createWrapper(UIStoryBody, {
      propsData: {
        story: {
          publishedDate: datetime,
          updatedAt: datetime,
        },
      },
    })
    expect(wrapper.find('.story__updated-at').exists()).toBe(false)
  })

  test('tags', () => {
    const mockTag1 = { id: '59cc4c64436a250d00312173', name: '市議員' }
    const mockTag2 = { id: '586207f43c1f950d00ce24da', name: '台北市長' }
    const wrapper = createWrapper(UIStoryBody, {
      propsData: {
        story: {
          tags: [mockTag1, mockTag2],
        },
      },
    })

    expect(wrapper.get(`[href="/tag/${mockTag1.id}/"]`).text()).toBe(
      mockTag1.name
    )
    expect(wrapper.get(`[href="/tag/${mockTag2.id}/"]`).text()).toBe(
      mockTag2.name
    )
  })

  test('not render tags when no tags', () => {
    const wrapper = createWrapper(UIStoryBody, {
      propsData: {
        story: {
          tags: [],
        },
      },
    })

    expect(wrapper.find('.story__tags').exists()).toBe(false)
  })
})

describe('UIShareSidebox.vue', () => {
  test('open when viewport >= md and users have scrolled', async () => {
    const wrapper = createWrapper(UIStoryBody, {
      mocks: {
        $nuxt: {
          context: {
            store: {
              getters: {
                'viewport/isViewportWidthUpMd': true,
              },
            },
          },
        },
      },
    })

    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent(UIShareSidebox).exists()).toBe(true)
  })

  test('close when viewport < md', async () => {
    const wrapper = createWrapper(UIStoryBody, {
      mocks: {
        $nuxt: {
          context: {
            store: {
              getters: {
                'viewport/isViewportWidthUpMd': false,
              },
            },
          },
        },
      },
    })

    expect(wrapper.findComponent(UIShareSidebox).exists()).toBe(false)

    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent(UIShareSidebox).exists()).toBe(false)
  })

  test("close when users haven't scrolled", () => {
    const wrapper = createWrapper(UIStoryBody, {
      mocks: {
        $nuxt: {
          context: {
            store: {
              getters: {
                'viewport/isViewportWidthUpMd': true,
              },
            },
          },
        },
      },
    })

    expect(wrapper.findComponent(UIShareSidebox).exists()).toBe(false)
  })
})

describe('handleSendGa', () => {
  test('call the $ga method when the UIShareSidebox.vue emits a "sendGa"', () => {
    const $ga = {
      event: jest.fn(),
    }
    const wrapper = createWrapper(UIStoryBody, {
      data() {
        return {
          shouldOpenShareSidebox: true,
        }
      },
      mocks: {
        $nuxt: {
          context: { $ga },
        },
      },
    })
    const gaArg = {
      eventCategory: 'article',
      eventAction: 'click',
      eventLabel: 'share line side',
    }

    wrapper.findComponent(UIShareSidebox).vm.$emit('sendGa', gaArg)

    expect($ga.event).toBeCalledWith(gaArg)
  })
})
