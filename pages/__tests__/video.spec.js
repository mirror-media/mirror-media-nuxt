import page from '../video/_id.vue'
import UiLinkedItemWithTitle from '~/components/UiLinkedItemWithTitle.vue'
import UiShareFb from '~/components/UiShareFb.vue'
import UiShareLine from '~/components/UiShareLine.vue'
import UiYoutubeIframe from '~/components/UiYoutubeIframe.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const idMock = 'NhhxOUw5o4E'
const createWrapper = createWrapperHelper({
  mocks: {
    $route: {
      params: {
        id: idMock,
      },
      query: {},
    },
    $ua: {
      isFromPc() {
        return true
      },
    },
  },
  stubs: ['client-only', 'GptAd'],
})

describe('video id', () => {
  const wrapper = createWrapper(page)
  test('should return proper videoId', () => {
    expect(wrapper.vm.videoId).toBe(idMock)
  })
  test('should has UiYoutubeIframe component', () => {
    expect(wrapper.findComponent(UiYoutubeIframe).exists()).toBe(true)
  })
})

describe('description', () => {
  test('should return proper parsed description', () => {
    const descriptionMock = 'abcdefg--'
    const wrapper = createWrapper(page, {
      data() {
        return {
          videoData: {
            description: descriptionMock,
          },
        }
      },
    })
    expect(wrapper.vm.descriptionParsed).toBe(descriptionMock)
  })
  test('should return proper parsed description when content contains line break', () => {
    const wrapper = createWrapper(page, {
      data() {
        return {
          videoData: {
            description: 'abcd↵efg\n\n',
          },
        }
      },
    })
    expect(wrapper.vm.descriptionParsed).toBe('abcd<br>efg<br><br>')
  })
  test('should return proper parsed description when content contains "-----" truncate symbol', () => {
    const wrapper = createWrapper(page, {
      data() {
        return {
          videoData: {
            description: 'abcdefg----------hijk',
          },
        }
      },
    })
    expect(wrapper.vm.descriptionParsed).toBe('abcdefg')
  })
})

describe('latest list data', () => {
  test('should render proper number of UiLinkedItemWithTitle', () => {
    const items = [
      {
        thumbnails: '',
        title: '',
        videoId: '',
      },
    ]
    const wrapper = createWrapper(page, {
      data() {
        return {
          listDataLatest: items,
        }
      },
    })
    const linkedItems = wrapper.findAllComponents(UiLinkedItemWithTitle)
    expect(linkedItems).toHaveLength(items.length)
  })
})

describe('share components', () => {
  test('should has share components', () => {
    const wrapper = createWrapper(page)
    expect(wrapper.findComponent(UiShareFb).exists()).toBe(true)
    expect(wrapper.findComponent(UiShareLine).exists()).toBe(true)
  })
})

describe('handleClick method', () => {
  const $ga = {
    event: jest.fn(),
  }
  const wrapper = createWrapper(page, {
    mocks: {
      $ga,
    },
    data() {
      return {
        listDataLatest: [
          {
            thumbnails: '',
            title: '',
            videoId: '',
          },
        ],
      }
    },
  })
  test('call $ga.event when UiLinkedItemWithTitle emits sendGa', () => {
    wrapper.findComponent(UiLinkedItemWithTitle).vm.$emit('click')
    expect($ga.event).toBeCalledWith({
      eventCategory: 'listing',
      eventAction: 'click',
      eventLabel: 'latest_video',
    })
  })
})
