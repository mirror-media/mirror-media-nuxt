import page from '../category/video_coverstory.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper()

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
    expect(wrapper.vm.remainingItems.length).toBe(playlistItemsMock.length - 5)
    expect(wrapper.vm.remainingItems).toEqual(playlistItemsMock.slice(5))
  })
})
