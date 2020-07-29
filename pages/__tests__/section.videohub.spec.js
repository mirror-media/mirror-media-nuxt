import videohub from '../section/videohub.vue'
import UIVideoIframeWithItems from '~/components/UIVideoIframeWithItems.vue'
import UIVideoPopular from '~/components/UIVideoPopular.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  mocks: {
    $fetchYoutubeSearch: jest.fn(),
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
  stubs: ['client-only', 'GPTAD'],
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

describe('handleSendGA method', () => {
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
  test('call $ga.event when UIVideoIframeWithItems emits sendGA', () => {
    wrapper.findComponent(UIVideoIframeWithItems).vm.$emit('sendGA', gaArgs)
    expect($ga.event).toBeCalledWith(gaArgs)
  })
  test('call $ga.event when UIVideoPopular emits sendGA', () => {
    wrapper.findComponent(UIVideoPopular).vm.$emit('sendGA', gaArgs)
    expect($ga.event).toBeCalledWith(gaArgs)
  })
})
