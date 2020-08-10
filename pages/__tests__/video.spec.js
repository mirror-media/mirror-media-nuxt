import page from '../video/_id.vue'
import UILinkedItemWithTitle from '~/components/UILinkedItemWithTitle.vue'
import UIShareFacebook from '~/components/UIShareFacebook.vue'
import UIShareLine from '~/components/UIShareLine.vue'
import UIYoutubeIframe from '~/components/UIYoutubeIframe.vue'
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
    $dayjs: jest.fn(() => ({
      format: jest.fn(),
    })),
    $ua: {
      isFromPc() {
        return true
      },
    },
  },
  stubs: ['client-only', 'GPTAD'],
})

describe('video id', () => {
  const wrapper = createWrapper(page)
  test('should return proper videoId', () => {
    expect(wrapper.vm.videoId).toBe(idMock)
  })
  test('should has UIYoutubeIframe component', () => {
    expect(wrapper.findComponent(UIYoutubeIframe).exists()).toBe(true)
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
  test('should render proper number of UILinkedItemWithTitle', () => {
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
    const linkedItems = wrapper.findAllComponents(UILinkedItemWithTitle)
    expect(linkedItems).toHaveLength(items.length)
  })
})

describe('share components', () => {
  test('should has share components', () => {
    const wrapper = createWrapper(page)
    expect(wrapper.findComponent(UIShareFacebook).exists()).toBe(true)
    expect(wrapper.findComponent(UIShareLine).exists()).toBe(true)
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
  test('call $ga.event when UILinkedItemWithTitle emits sendGA', () => {
    wrapper.findComponent(UILinkedItemWithTitle).vm.$emit('click')
    expect($ga.event).toBeCalledWith({
      eventCategory: 'listing',
      eventAction: 'click',
      eventLabel: 'latest_video',
    })
  })
})
