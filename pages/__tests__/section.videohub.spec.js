import videohub from '../section/videohub.vue'
import UiVideoIframeWithItems from '~/components/UiVideoIframeWithItems.vue'
import UiVideoPopular from '~/components/UiVideoPopular.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  mocks: {
    $fetchYoutubeSearch: jest.fn(() => Promise.resolve({ items: [] })),
    $fetchYoutubeVideos: jest.fn(() => Promise.resolve({ items: [] })),
    $store: {
      state: {
        sections: {
          data: {
            items: [],
          },
        },
      },
    },
    $ua: {
      isFromPc() {
        return true
      },
    },
  },
  stubs: ['client-only', 'GptAd'],
})

describe('isThisSection method', () => {
  const sectionName = 'videohub'
  const wrapper = createWrapper(videohub, {
    mocks: {
      $route: {
        path: `/section/${sectionName}`,
      },
    },
  })

  test('section name is equal to route path', () => {
    const sectionData = {
      name: sectionName,
    }
    expect(wrapper.vm.isThisSection(sectionData)).toBe(true)
  })
  test('section name is not equal to route path', () => {
    const sectionData = {
      name: 'test',
    }
    expect(wrapper.vm.isThisSection(sectionData)).toBe(false)
  })
})

describe('handleSendGa method', () => {
  const $ga = {
    event: jest.fn(),
  }
  const gaArgs = {
    eventCategory: 'listing',
    eventAction: 'click',
    eventLabel: 'test',
  }
  const wrapper = createWrapper(videohub, {
    mocks: {
      $ga,
    },
  })
  test('call $ga.event when UiVideoIframeWithItems emits sendGa', () => {
    wrapper.findComponent(UiVideoIframeWithItems).vm.$emit('sendGa', gaArgs)
    expect($ga.event).toBeCalledWith(gaArgs)
  })
  test('call $ga.event when UiVideoPopular emits sendGa', () => {
    wrapper.findComponent(UiVideoPopular).vm.$emit('sendGa', gaArgs)
    expect($ga.event).toBeCalledWith(gaArgs)
  })
})
