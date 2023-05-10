import ContainerStoryBody, {
  THE_LAST_NUM_AD_INSERT_API_DATA_UNSTYLED_AND_NOT_EMPTY,
  AD_KEYS_IN_STORY_CONTENT,
} from '../ContainerStoryBody.vue'
import UiStoryVideo from '../UiStoryVideo.vue'
import UiShareSidebox from '../UiShareSidebox.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'
import { ARTICLE_DATE_TIME_POSTFIX } from '~/constants'

const createWrapper = createWrapperHelper({
  propsData: {
    story: {},
  },
  mocks: {
    $store: {
      state: { canAdvertise: true },
    },
    $nuxt: {
      context: {
        store: { getters: {} },
      },
    },
    $config: {
      donateFeatureToggle: false,
    },
  },
  stubs: ['ClientOnly'],
})

describe('render the proper content from props "story"', () => {
  const heroVideoMock = {
    video: { url: 'https://www.google.com/' },
  }
  const heroCaptionMock = 'hero caption'

  test('published date', () => {
    const publishedDate = 'Mon, 14 Sep 2020 08:29:45 GMT'
    const wrapper = createWrapper(ContainerStoryBody, {
      propsData: {
        story: {
          publishedDate,
        },
      },
    })
    expect(wrapper.get('.story__published-date').text()).toBe(
      `2020.09.14 16:29 ${ARTICLE_DATE_TIME_POSTFIX}`
    )
  })

  test('title', () => {
    const titleMock = 'test'
    const wrapper = createWrapper(ContainerStoryBody, {
      propsData: {
        story: {
          title: titleMock,
        },
      },
    })
    const title = wrapper.get('h1')
    expect(title.text()).toBe(titleMock)
  })

  test('subtitle', () => {
    const subtitleMock = '副標'
    const wrapper = createWrapper(ContainerStoryBody, {
      propsData: {
        story: {
          subtitle: subtitleMock,
        },
      },
    })

    expect(wrapper.get('h2').text()).toBe(subtitleMock)
  })

  test('should not render subtitle when no subtitle', () => {
    const wrapper = createWrapper(ContainerStoryBody)

    expect(wrapper.find('h2').exists()).toBe(false)
  })

  test('sections', () => {
    const sectionNameMock = 'section-name'
    const wrapper = createWrapper(ContainerStoryBody, {
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

  test('sectionId should be "other" when no sections', () => {
    const wrapper = createWrapper(ContainerStoryBody)

    expect(wrapper.vm.sectionId).toBe('other')
  })

  test('categories', () => {
    const categoryTitleMock = 'category title'
    const wrapper = createWrapper(ContainerStoryBody, {
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
    const wrapper = createWrapper(ContainerStoryBody, {
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
    const wrapper = createWrapper(ContainerStoryBody, {
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

  test('hero video', () => {
    const wrapper = createWrapper(ContainerStoryBody, {
      propsData: {
        story: {
          heroVideo: heroVideoMock,
          heroCaption: heroCaptionMock,
        },
      },
    })

    expect(wrapper.findComponent(UiStoryVideo).exists()).toBe(true)
    expect(wrapper.get('.story__hero-caption').text()).toBe(heroCaptionMock)

    expect(wrapper.find('figure.story__hero').exists()).toBe(false)
  })

  test('should render hero img when no hero video', () => {
    const heroImgUrlMock = 'https://image.jpg'
    const wrapper = createWrapper(ContainerStoryBody, {
      propsData: {
        story: {
          heroImage: {
            image: {
              resizedTargets: { mobile: { url: heroImgUrlMock } },
            },
          },
          heroCaption: heroCaptionMock,
        },
      },
    })

    expect(wrapper.findComponent(UiStoryVideo).exists()).toBe(false)

    expect(wrapper.get('figure.story__hero img').attributes().src).toBe(
      heroImgUrlMock
    )
    expect(wrapper.get('figure.story__hero figcaption').text()).toBe(
      heroCaptionMock
    )
  })

  test('should render hero img from story.thumb for external story spec', () => {
    const thumbUrlMock = 'https://image.jpg'
    const wrapper = createWrapper(ContainerStoryBody, {
      propsData: {
        story: {
          thumb: thumbUrlMock,
        },
      },
    })
    expect(wrapper.findComponent(UiStoryVideo).exists()).toBe(false)
    expect(wrapper.get('figure.story__hero img').attributes().src).toBe(
      thumbUrlMock
    )
  })

  test('should not render hero caption when no hero caption', async () => {
    const wrapper = createWrapper(ContainerStoryBody, {
      propsData: {
        story: {
          heroVideo: heroVideoMock,
        },
      },
    })

    expect(wrapper.find('.story__hero-caption').exists()).toBe(false)

    // 改換 render hero img
    await wrapper.setProps({
      story: {},
    })

    expect(wrapper.find('figure.story__hero figcaption').exists()).toBe(false)
  })

  test('updated-at should be rendered', () => {
    const updatedAt = 'Mon, 14 Sep 2020 08:29:45 GMT'
    const wrapper = createWrapper(ContainerStoryBody, {
      propsData: {
        story: {
          updatedAt,
        },
      },
    })
    expect(wrapper.get('.story__updated-at').text()).toBe(
      `更新時間｜2020.09.14 16:29 ${ARTICLE_DATE_TIME_POSTFIX}`
    )
  })

  test('updated-at should not be rendered', () => {
    const datetime = 'Mon, 14 Sep 2020 08:29:45 GMT'
    const wrapper = createWrapper(ContainerStoryBody, {
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
    const wrapper = createWrapper(ContainerStoryBody, {
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
    const wrapper = createWrapper(ContainerStoryBody, {
      propsData: {
        story: {
          tags: [],
        },
      },
    })

    expect(wrapper.find('.story__tags').exists()).toBe(false)
  })
})

describe('UiShareSidebox.vue', () => {
  test('open when viewport >= md and users have scrolled', async () => {
    const wrapper = createWrapper(ContainerStoryBody, {
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

    expect(wrapper.findComponent(UiShareSidebox).exists()).toBe(true)
  })

  test('close when viewport < md', async () => {
    const wrapper = createWrapper(ContainerStoryBody, {
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

    expect(wrapper.findComponent(UiShareSidebox).exists()).toBe(false)

    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent(UiShareSidebox).exists()).toBe(false)
  })

  test("close when users haven't scrolled", () => {
    const wrapper = createWrapper(ContainerStoryBody, {
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

    expect(wrapper.findComponent(UiShareSidebox).exists()).toBe(false)
  })
})

describe('computed "content" for external story', () => {
  test('should have content', () => {
    const contentMock = '<p>test content</p>'
    const wrapper = createWrapper(ContainerStoryBody, {
      propsData: {
        story: {
          content: contentMock,
        },
      },
    })
    expect(wrapper.get('.story__external-content').html()).toContain(
      contentMock
    )
  })
})

describe('computed "contents"', () => {
  const sectionIdMock = '57e1e11cee85930e00cad4ea'

  test('should not have any ADs when unstyled and not empty contents of "apiData" <= 1', () => {
    const apiDataNumOfUnstyledAndNotEmptyMock = 1

    applyTestToContents(apiDataNumOfUnstyledAndNotEmptyMock, (contents) => {
      expect(contents).toHaveLength(apiDataNumOfUnstyledAndNotEmptyMock)

      AD_KEYS_IN_STORY_CONTENT.forEach((adKey) => {
        expect(contents).not.toContainEqual({
          type: 'gpt-ad',
          pageKey: sectionIdMock,
          adKey,
        })
      })
    })
  })

  test('should at least have AD of MB_AT1 when unstyled and not empty contents of "apiData" >= 2', () => {
    const apiDataNumOfUnstyledAndNotEmptyMock = 2

    applyTestToContents(apiDataNumOfUnstyledAndNotEmptyMock, (contents) => {
      expect(contents).toHaveLength(
        apiDataNumOfUnstyledAndNotEmptyMock +
          AD_KEYS_IN_STORY_CONTENT.length -
          2
      )

      findAdsInContents([1], contents)
    })
  })

  test('should at least have ADs of PC_AT1 and MB_AT1 when unstyled and not empty contents of "apiData" >= 4', () => {
    const apiDataNumOfUnstyledAndNotEmptyMock = 4

    applyTestToContents(apiDataNumOfUnstyledAndNotEmptyMock, (contents) => {
      expect(contents).toHaveLength(
        apiDataNumOfUnstyledAndNotEmptyMock +
          AD_KEYS_IN_STORY_CONTENT.length -
          1
      )

      findAdsInContents([1, 4], contents)
    })
  })

  test('should have all ADs with correct order when unstyled and not empty contents of "apiData" >= 6', () => {
    const apiDataNumOfUnstyledAndNotEmptyMock =
      THE_LAST_NUM_AD_INSERT_API_DATA_UNSTYLED_AND_NOT_EMPTY

    applyTestToContents(apiDataNumOfUnstyledAndNotEmptyMock, (contents) => {
      expect(contents).toHaveLength(
        apiDataNumOfUnstyledAndNotEmptyMock + AD_KEYS_IN_STORY_CONTENT.length
      )

      findAdsInContents([1, 4, 7], contents)
    })
  })

  test('should render correctly when "apiData" has no unstyled and not empty contents', () => {
    const apiDataNumOfNormal = 2
    const wrapper = createWrapper(ContainerStoryBody, {
      propsData: {
        story: {
          content: {
            apiData: Array(apiDataNumOfNormal).fill({
              type: 'other',
              content: ['其它'],
            }),
          },
          sections: [{ id: sectionIdMock }],
        },
      },
    })

    expect(wrapper.vm.contents).toHaveLength(apiDataNumOfNormal)
  })

  function applyTestToContents(apiDataNumOfUnstyledAndNotEmpty, expectFn) {
    const wrapper = createWrapper(ContainerStoryBody, {
      propsData: {
        story: {
          content: {
            apiData: Array(apiDataNumOfUnstyledAndNotEmpty).fill({
              type: 'unstyled',
              content: ['內容'],
            }),
          },
          sections: [{ id: sectionIdMock }],
        },
      },
    })

    expectFn(wrapper.vm.contents)
  }

  function findAdsInContents(idxesAdInContents, contents) {
    idxesAdInContents.forEach((idxAd, idx) => {
      expect(contents[idxAd]).toEqual({
        type: 'gpt-ad',
        pageKey: sectionIdMock,
        adKey: AD_KEYS_IN_STORY_CONTENT[idx],
      })
    })
  }
})

describe('GA events', () => {
  test('send a GA event when users click a tag', () => {
    /* Arrange */
    const $ga = { event: jest.fn() }
    const sut = createWrapper(ContainerStoryBody, {
      propsData: {
        story: {
          tags: [{}],
        },
      },
      mocks: { $ga },
    })

    /* Act */
    sut.get('.story__tags a').trigger('click')

    /* Assert */
    expect($ga.event).toBeCalledWith({
      eventCategory: 'article',
      eventAction: 'click',
      eventLabel: 'tag',
    })
  })

  test('send a GA event if the component UiShareSidebox emits a "sendGa" event', () => {
    /* Arrange */
    const $ga = { event: jest.fn() }
    const sut = createWrapper(ContainerStoryBody, {
      data() {
        return {
          shouldOpenShareSidebox: true,
        }
      },
      mocks: { $ga },
    })
    const gaArg = {
      eventCategory: 'article',
      eventAction: 'click',
      eventLabel: 'share line side',
    }

    /* Act */
    sut.getComponent(UiShareSidebox).vm.$emit('sendGa', gaArg)

    /* Assert */
    expect($ga.event).toBeCalledWith(gaArg)
  })
})

/**
 * dableWidget 由於是 slot，因此無法測試
 * 其餘未寫入此測試的廣告，會在 <ContainerGptAd> 內部處理
 */
test('should not render any ADs when canAdvertise is false', () => {
  const wrapper = createWrapper(ContainerStoryBody, {
    mocks: {
      $store: {
        state: { canAdvertise: false },
      },
    },
  })

  expect(wrapper.find('.story__ad-container').exists()).toBe(false)
})

test('render the content under the condition that isAdvertised is true', () => {
  const sut = createWrapper(ContainerStoryBody, {
    computed: {
      isAdvertised: () => true,
      categoryTitle: () => 'test category title',
    },
  })

  expect(sut.find('.story__category').exists()).toBe(false)
})
