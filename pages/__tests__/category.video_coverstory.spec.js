import page from '../category/video_coverstory.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  mocks: {
    $ua: {
      isFromPc() {
        return true
      },
    },
  },
  stubs: ['client-only', 'GPTAD'],
})

const sectionNameMock = 'video_coverstory'
const playlistItemsMock = [
  { videoId: 1 },
  { videoId: 2 },
  { videoId: 3 },
  { videoId: 4 },
  { videoId: 5 },
  { videoId: 6 },
]

const wrapper = createWrapper(page, {
  mocks: {
    $route: {
      path: `/category/${sectionNameMock}`,
    },
  },
  data() {
    return {
      playlistItems: playlistItemsMock,
    }
  },
})

describe('computed data', () => {
  test('should return proper categoryName', () => {
    expect(wrapper.vm.categoryName).toBe(sectionNameMock)
  })
  test('should return proper firstFiveItems', () => {
    const playlistItemsMock = [
      { videoId: 1 },
      { videoId: 2 },
      { videoId: 3 },
      { videoId: 4 },
      { videoId: 5 },
      { videoId: 6 },
    ]
    expect(wrapper.vm.firstFiveItems.length).toBe(5)
    expect(wrapper.vm.firstFiveItems).toEqual(playlistItemsMock.slice(0, 5))
  })
  test('should return proper remainingItems', () => {
    expect(wrapper.vm.remainingItemsBeforeMobileAd.videoId).toEqual(
      playlistItemsMock[5].videoId
    )
    expect(wrapper.vm.remainingItemsAfterMobileAdBeforeDesktopAd.length).toBe(0)
    expect(wrapper.vm.remainingItemsAfterDesktopAd.length).toBe(0)
  })
})
