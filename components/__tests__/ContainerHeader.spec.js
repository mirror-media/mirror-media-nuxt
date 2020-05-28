import ContainerHeader from '../ContainerHeader.vue'
import UISidebar from '../UISidebar.vue'
import UISearchBarWrapper from '../UISearchBarWrapper.vue'
import UIOthersList from '../UIOthersList.vue'
import UIHeaderNavSection from '../UIHeaderNavSection.vue'
import UIHeaderNavTopic from '../UIHeaderNavTopic.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  computed: {
    sections: () => [],
    partners: () => [],
    topics: () => [],
  },
})

describe('options computed', () => {
  test('get the proper data', () => {
    const wrapper = createWrapper(ContainerHeader, {
      computed: {
        sections: () => [{ title: '文化' }, { name: 'videohub' }],
      },
    })

    expect(wrapper.vm.options).toEqual([
      { title: '全部類別' },
      { title: '文化' },
    ])
  })
})

describe('sidebar', () => {
  test('open sidebar when users click menu icon', async () => {
    const wrapper = createWrapper(ContainerHeader, {
      mocks: {
        $ga: { event: jest.fn() },
      },
    })

    await wrapper.get('.menu-icon').trigger('click')
    expect(wrapper.findComponent(UISidebar).exists()).toBe(true)
  })

  test('close sidebar when UISidebar.vue emits close', async () => {
    const wrapper = createWrapper(ContainerHeader, {
      data() {
        return {
          shouldOpenSidebar: true,
        }
      },
      mocks: {
        $ga: { event: jest.fn() },
      },
    })

    wrapper.findComponent(UISidebar).vm.$emit('close')
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(UISidebar).exists()).toBe(false)
  })

  test('close sidebar when URL changes', async () => {
    const wrapper = createWrapper(ContainerHeader, {
      data() {
        return {
          shouldOpenSidebar: true,
        }
      },
      mocks: {
        $route: { fullPath: '/' },
      },
    })

    wrapper.vm.$route.fullPath = '/section/news'
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(UISidebar).exists()).toBe(false)
  })
})

describe('GA event', () => {
  test('call $ga method when users click menu icon', () => {
    const $ga = {
      event: jest.fn(),
    }
    const wrapper = createWrapper(ContainerHeader, {
      mocks: {
        $ga,
      },
    })

    const gaArgs = {
      eventCategory: 'header',
      eventAction: 'click',
      eventLabel: 'menu open',
    }
    wrapper.get('.menu-icon').trigger('click')
    expect($ga.event).toBeCalledWith(gaArgs)
  })

  test('call $ga method when UISidebar.vue emits close', () => {
    const $ga = {
      event: jest.fn(),
    }
    const wrapper = createWrapper(ContainerHeader, {
      data() {
        return {
          shouldOpenSidebar: true,
        }
      },
      mocks: {
        $ga,
      },
    })

    const gaArgs = {
      eventCategory: 'header',
      eventAction: 'click',
      eventLabel: 'menu close',
    }
    wrapper.findComponent(UISidebar).vm.$emit('close')
    expect($ga.event).toBeCalledWith(gaArgs)
  })
})

describe('handleSendGA method', () => {
  test('call $ga method when UISidebar.vue emits sendGA', () => {
    const $ga = {
      event: jest.fn(),
    }
    const wrapper = createWrapper(ContainerHeader, {
      data() {
        return {
          shouldOpenSidebar: true,
        }
      },
      mocks: {
        $ga,
      },
    })

    const gaArgs = {
      eventCategory: 'sidebar',
      eventAction: 'click',
      eventLabel: 'section new',
    }
    wrapper.findComponent(UISidebar).vm.$emit('sendGA', gaArgs)
    expect($ga.event).toBeCalledWith(gaArgs)
  })

  test('call $ga method when UISearchBarWrapper.vue emits sendGA', () => {
    const $ga = {
      event: jest.fn(),
    }
    const wrapper = createWrapper(ContainerHeader, {
      mocks: {
        $ga,
      },
    })

    const gaArgs = {
      eventCategory: 'header',
      eventAction: 'click',
      eventLabel: 'search',
    }
    wrapper.findComponent(UISearchBarWrapper).vm.$emit('sendGA', gaArgs)
    expect($ga.event).toBeCalledWith(gaArgs)
  })

  test('call $ga method when UIOthersList.vue emits sendGA', () => {
    const $ga = {
      event: jest.fn(),
    }
    const wrapper = createWrapper(ContainerHeader, {
      mocks: {
        $ga,
      },
    })

    const gaArgs = {
      eventCategory: 'header',
      eventAction: 'click',
      eventLabel: 'more subscribe',
    }
    wrapper.findComponent(UIOthersList).vm.$emit('sendGA', gaArgs)
    expect($ga.event).toBeCalledWith(gaArgs)
  })

  test('call $ga method when UIHeaderNavSection.vue emits sendGA', () => {
    const $ga = {
      event: jest.fn(),
    }
    const wrapper = createWrapper(ContainerHeader, {
      mocks: {
        $ga,
      },
    })

    const gaArgs = {
      eventCategory: 'header',
      eventAction: 'click',
      eventLabel: 'section news',
    }
    wrapper.findComponent(UIHeaderNavSection).vm.$emit('sendGA', gaArgs)
    expect($ga.event).toBeCalledWith(gaArgs)
  })

  test('call $ga method when UIHeaderNavTopic.vue emits sendGA', () => {
    const $ga = {
      event: jest.fn(),
    }
    const wrapper = createWrapper(ContainerHeader, {
      mocks: {
        $ga,
      },
    })

    const gaArgs = {
      eventCategory: 'header',
      eventAction: 'click',
      eventLabel: 'topic 人造地獄',
    }
    wrapper.findComponent(UIHeaderNavTopic).vm.$emit('sendGA', gaArgs)
    expect($ga.event).toBeCalledWith(gaArgs)
  })
})
