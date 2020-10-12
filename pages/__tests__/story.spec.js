import Story from '../story/_slug.vue'
import UIStoryListWithHeading from '~/components/UIStoryListWithHeading.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  computed: {
    isDesktopWidth: () => true,
  },
  stubs: ['ClientOnly'],
})

describe('latest list', () => {
  test('open when viewport >= lg', () => {
    const wrapper = createWrapper(Story)

    expect(wrapper.find('.story__list--latest').exists()).toBe(true)
  })

  test('close when viewport < lg', () => {
    const wrapper = createWrapper(Story, {
      computed: {
        isDesktopWidth: () => false,
      },
    })

    expect(wrapper.find('.story__list--latest').exists()).toBe(false)
  })

  test('open UIStoryListWithHeading when latest stories are loaded', () => {
    const wrapper = createWrapper(Story, {
      data() {
        return {
          latestStories: [{}],
        }
      },
    })

    expect(
      wrapper
        .get('.story__list--latest')
        .findComponent(UIStoryListWithHeading)
        .exists()
    ).toBe(true)
  })

  test('close UIStoryListWithHeading when latest stories are not loaded', () => {
    const wrapper = createWrapper(Story)

    expect(
      wrapper
        .get('.story__list--latest')
        .findComponent(UIStoryListWithHeading)
        .exists()
    ).toBe(false)
  })

  test('render the proper latest stories', async () => {
    const mockStorySlug = '20201007fin003'
    const mockLatestStoryWithCurrentStorySlug = { slug: mockStorySlug }
    const mockLatestStories = [
      mockLatestStoryWithCurrentStorySlug,
      ...Array(8).fill({}),
    ]
    const wrapper = createWrapper(Story, {
      mocks: {
        $route: { params: { slug: mockStorySlug } },
        $fetchList: () => Promise.resolve({ items: mockLatestStories }),
      },
    })

    const latestList = wrapper.get('.story__list--latest')
    latestList.vm.$emit('show')
    await wrapper.vm.$nextTick()

    const { items } = latestList.findComponent(UIStoryListWithHeading).props()

    expect(items).toHaveLength(6)
    expect(items).not.toContainEqual(mockLatestStoryWithCurrentStorySlug)
  })

  /**
   * 由於 UIStoryListWithHeading 的內容是需要打 API 取得，又沒 SSR，所以內容一開始會是空的
   * 其底下的元件因此會往上擠，出現在視埠（viewport）之中，導致這些應該被 lazy load 的元件，在一開始就被載入進來
   * 為了避免這個問題，需要在一開始元件還沒內容時，就給它一個固定高度 100vh，以確保其底下的元件不會出現在視埠之中
   * 直到元件有內容後，再拿掉固定高度，讓其底下元件達到 lazy load 的效果
   */
  test('has height 100vh when latest stories are not loaded', async () => {
    const wrapper = createWrapper(Story)
    const latestList = wrapper.get('.story__list--latest')

    expect(latestList.element.style.height).toBe('100vh')

    await wrapper.setData({ latestStories: [{}] })

    expect(latestList.element.style.height).toBe('')
  })
})
