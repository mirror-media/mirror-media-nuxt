import Story from '../story/_slug.vue'
import ContainerHeader from '~/components/ContainerHeader.vue'
import UiWineWarning from '~/components/UiWineWarning.vue'
import UiStickyAd from '~/components/UiStickyAd.vue'
import ContainerFullScreenAds from '~/components/ContainerFullScreenAds.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'
import { DOMAIN_NAME } from '~/configs/config.js'
import {
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_URL,
  SECTION_IDS,
} from '~/constants/index'

const createWrapper = createWrapperHelper({
  computed: {
    isDesktopWidth: () => true,
  },
  mocks: {
    $store: {
      state: { canAdvertise: true },
    },
    $nuxt: {
      context: {
        store: { commit() {} },
      },
    },
  },
  stubs: ['ClientOnly'],
})

const storyMockRequired = {
  publishedDate: 'Tue, 13 Oct 2020 08:59:35 GMT',
  updatedAt: 'Tue, 13 Oct 2020 08:59:36 GMT',
}

const routeMock = {
  path: '/story/20201013edi033/',
  params: { slug: '20201013edi033' },
}

describe('latest list', () => {
  const storyWithSectionsMock = {
    sections: [{ id: '57e1e0e5ee85930e00cad4e9' }],
  }

  test('should render when viewport >= lg', () => {
    const wrapper = createWrapper(Story, {
      data() {
        return {
          story: storyWithSectionsMock,
        }
      },
    })

    expect(wrapper.find('.latest-list').exists()).toBe(true)
  })

  test('should not render when viewport < lg', () => {
    const wrapper = createWrapper(Story, {
      data() {
        return {
          story: storyWithSectionsMock,
        }
      },
      computed: {
        isDesktopWidth: () => false,
      },
    })

    expect(wrapper.find('.latest-list').exists()).toBe(false)
  })

  test('should not render when no sections', () => {
    const wrapper = createWrapper(Story)

    expect(wrapper.find('.latest-list').exists()).toBe(false)
  })

  test('should render UiStoryListWithHeading when latest stories are loaded', () => {
    const wrapper = createWrapper(Story, {
      data() {
        return {
          hasLoadedLatestStories: true,
          latestStories: [{}],
          story: storyWithSectionsMock,
        }
      },
    })

    expect(wrapper.find('.latest-list').exists()).toBe(true)
  })

  test('should not render UiStoryListWithHeading when latest stories are not loaded', () => {
    const wrapper = createWrapper(Story, {
      data() {
        return {
          hasLoadedLatestStories: true,
          story: storyWithSectionsMock,
        }
      },
    })

    expect(wrapper.find('.latest-list').exists()).toBe(false)
  })

  test('should render the proper latest stories', async () => {
    const mockStorySlug = '20201007fin003'
    const mockLatestStoryWithCurrentStorySlug = { slug: mockStorySlug }
    const mockLatestStories = [
      mockLatestStoryWithCurrentStorySlug,
      ...Array(8).fill({}),
    ]
    const wrapper = createWrapper(Story, {
      data() {
        return {
          story: storyWithSectionsMock,
        }
      },
      mocks: {
        $route: { params: { slug: mockStorySlug } },
        $fetchList: () => Promise.resolve({ items: mockLatestStories }),
      },
    })

    wrapper.get('.lazy-latest-list').vm.$emit('show')
    await wrapper.vm.$nextTick()

    const { items } = wrapper.get('.latest-list').props()

    expect(items).toHaveLength(6)
    expect(items).not.toContainEqual(mockLatestStoryWithCurrentStorySlug)
  })

  /**
   * 由於 latest list 的內容是需要打 API 取得，又沒 SSR，所以內容一開始會是空的
   * 其底下的元件因此會往上擠，出現在視埠（viewport）之中，導致這些應該被 lazy load 的元件，在一開始就被載入進來
   * 為了避免這個問題，需要在一開始元件還沒內容時，就給它一個固定高度 100vh，以確保其底下的元件不會出現在視埠之中
   * 直到元件有內容後，再拿掉固定高度，讓其底下元件達到 lazy load 的效果
   */
  test('its height should be 100vh when latest stories are not loaded', async () => {
    const wrapper = createWrapper(Story, {
      data() {
        return {
          story: storyWithSectionsMock,
        }
      },
    })
    const lazyLatestList = wrapper.get('.lazy-latest-list')

    expect(lazyLatestList.element.style.height).toBe('100vh')

    await wrapper.setData({ latestStories: [{}] })

    expect(lazyLatestList.element.style.height).toBe('')
  })
})

describe('AD', () => {
  test('should not load gpt script when canAdvertise is false', () => {
    const wrapper = createWrapper(Story, {
      data() {
        return {
          story: storyMockRequired,
        }
      },
      mocks: {
        $store: {
          state: { canAdvertise: false },
        },
        $route: routeMock,
      },
    })
    const { link, script } = wrapper.vm.$options.head.call(wrapper.vm)

    expect(findValByHid(link, 'gptLink').skip).toBe(true)
    expect(findValByHid(script, 'gptScript').skip).toBe(true)

    function findValByHid(list = [], hid) {
      return list.find((item) => item.hid === hid)
    }
  })

  /**
   * <MicroAd>、popinAd 和桌機版的 dableWidget 由於是 slot，因此無法測試
   * 其餘未寫入此測試的廣告，會在 <ContainerGptAd> 內部處理
   */
  test('should not render any ADs when canAdvertise is false', () => {
    const wrapper = createWrapper(Story, {
      data() {
        return {
          story: {
            sections: [{ id: SECTION_IDS.carandwatch }],
          },
        }
      },
      computed: {
        isDesktopWidth: () => false,
      },
      mocks: {
        $store: {
          state: { canAdvertise: false },
        },
      },
    })

    expect(wrapper.find('.dable-widget').exists()).toBe(false)
    expect(wrapper.findComponent(UiStickyAd).exists()).toBe(false)
    expect(wrapper.findComponent(ContainerFullScreenAds).exists()).toBe(false)
    expect(wrapper.find('.ad-pc-floating').exists()).toBe(false)
  })

  test('do not show ADs of MB_ST, MB_FS, MB_AD2 & MB_INNITY when a story has the wine category name', () => {
    testStoryWithWineCategory((sut) => {
      // MB_ST
      expect(sut.findComponent(UiStickyAd).exists()).toBe(false)

      // MB_FS, MB_AD2 & MB_INNITY
      expect(sut.findComponent(ContainerFullScreenAds).exists()).toBe(false)
    })
  })
})

describe('JSON-LD', () => {
  test('should render the proper content in most cases', () => {
    const storyMock = {
      title: '蔡英文視察樂山雷達站',
      ogDescription: '近期共軍頻繁擾台',
      ogImage: {
        image: {
          resizedTargets: {
            tablet: {
              url:
                'https://www.mirrormedia.com.tw/assets/images/20201013164229-0272e9dd58d7935dfa1d4aa1cb9dcf4a-mobile.jpg',
            },
          },
        },
      },
      writers: [{ name: '謝文哲', id: '5cf77f941b66ac1100159d2b' }],
      sections: [{ title: '時事、生活', name: 'news' }],
      ...storyMockRequired,
    }

    const wrapper = createWrapper(Story, {
      data() {
        return {
          story: storyMock,
        }
      },
      mocks: {
        $route: routeMock,
      },
    })

    const {
      title,
      ogDescription,
      ogImage,
      publishedDate,
      updatedAt,
      writers,
      sections,
    } = storyMock
    const pageUrl = `https://${DOMAIN_NAME}${routeMock.path}`
    const imgUrl = ogImage.image.resizedTargets.tablet.url
    const logoUrl = require('~/assets/logo.png')
    const { name: writerName, id: writerId } = writers[0]
    const { title: sectionTitle, name: sectionName } = sections[0]

    const { script } = wrapper.vm.$options.head.call(wrapper.vm)

    expect(findJsonLdByType(script, 'NewsArticle')).toEqual({
      type: 'application/ld+json',
      json: {
        '@context': 'https://schema.org/',
        '@type': 'NewsArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': pageUrl,
        },
        headline: title,
        image: imgUrl,
        datePublished: new Date(publishedDate).toISOString(),
        dateModified: new Date(updatedAt).toISOString(),
        author: {
          '@type': 'Person',
          name: writerName,
        },
        publisher: {
          '@type': 'Organization',
          name: SITE_TITLE,
          logo: {
            '@type': 'ImageObject',
            url: logoUrl,
          },
        },
        description: ogDescription,
        url: pageUrl,
        thumbnailUrl: imgUrl,
        articleSection: sectionTitle,
      },
    })

    expect(findJsonLdByType(script, 'Person')).toEqual({
      type: 'application/ld+json',
      json: {
        '@context': 'http://schema.org/',
        '@type': 'Person',
        name: writerName,
        url: `${SITE_URL}/author/${writerId}/`,
        brand: {
          '@type': 'Brand',
          name: SITE_TITLE,
          url: SITE_URL,
          image: logoUrl,
          logo: logoUrl,
          description: SITE_DESCRIPTION,
        },
      },
    })

    expect(findJsonLdByType(script, 'BreadcrumbList')).toEqual({
      type: 'application/ld+json',
      json: {
        '@context': 'http://schema.org/',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: SITE_TITLE,
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: sectionTitle,
            item: `${SITE_URL}/section/${sectionName}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: title,
            item: pageUrl,
          },
        ],
      },
    })
  })

  test('should change the @type NewsArticle author when the story does not has a writer', () => {
    applyTestWithMinimalSetting((script) => {
      expect(findJsonLdByType(script, 'NewsArticle').json.author).toEqual({
        '@type': 'Organization',
        name: '鏡週刊',
      })
    })
  })

  test('@type NewsArticle articleSection should be undefined when the story does not has a section title', () => {
    applyTestWithMinimalSetting((script) => {
      expect(
        findJsonLdByType(script, 'NewsArticle').json.articleSection
      ).toBeUndefined()
    })
  })

  test('@type Person should be omitted when the story does not has a writer', () => {
    applyTestWithMinimalSetting((script) => {
      expect(findJsonLdByType(script, 'Person')).toBeUndefined()
    })
  })

  function applyTestWithMinimalSetting(expectFn) {
    const wrapper = createWrapper(Story, {
      data() {
        return {
          story: storyMockRequired,
        }
      },
      mocks: {
        $route: routeMock,
      },
    })

    expectFn(wrapper.vm.$options.head.call(wrapper.vm).script)
  }

  function findJsonLdByType(scripts = [], type) {
    return scripts.find((script) => script.json?.['@type'] === type)
  }
})

test('hightlight the section navbar item', () => {
  /* Arrange */
  const sectionNameMock = 'test section name'
  const sut = createWrapper(Story, {
    computed: {
      sectionName: () => sectionNameMock,
    },
  })

  /* Assert */
  expect(sut.getComponent(ContainerHeader).props().currentSectionName).toBe(
    sectionNameMock
  )
})

test('show the wine warning when a story has the wine category name', () => {
  testStoryWithWineCategory((sut) => {
    expect(sut.findComponent(UiWineWarning).exists()).toBe(true)
  })
})

test('sectionId should be "other" when no sections', () => {
  const wrapper = createWrapper(Story)

  expect(wrapper.vm.sectionId).toBe('other')
})

function testStoryWithWineCategory(assert) {
  const sut = createWrapper(Story, {
    data() {
      return {
        story: {
          categories: [{ name: 'wine' }],
        },
      }
    },
  })

  assert(sut)
}
