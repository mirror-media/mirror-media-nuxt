import ContainerHeader from '../ContainerHeader.vue'
import UIEventLogo from '../UIEventLogo.vue'
import UISearchBarWrapper from '../UISearchBarWrapper.vue'
import UIOthersList from '../UIOthersList.vue'
import UIHeaderNavSection from '../UIHeaderNavSection.vue'
import UIHeaderNavTopic from '../UIHeaderNavTopic.vue'
import UISidebar from '../UISidebar.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  computed: {
    sections: () => [],
    partners: () => [],
    topics: () => [],
  },
  mocks: {
    $fetchEvent: () => Promise.resolve({}),
  },
  stubs: ['nuxt-link'],
})

describe('event logo', () => {
  test('get the correct value from the $fetchEvent method', async () => {
    const mockEventLogo = { name: '泰山油LOGO' }
    const wrapper = createWrapper(ContainerHeader, {
      data() {
        return {
          now: new Date('Tue Jun 09 2020 18:30:00 GMT+0800'),
        }
      },
      mocks: {
        $fetchEvent: () =>
          Promise.resolve({
            items: [mockEventLogo],
          }),
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.vm.eventLogo).toEqual(mockEventLogo)
  })

  test('close the logo if it has no data', async () => {
    const wrapper = createWrapper(ContainerHeader)

    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(UIEventLogo).exists()).toBe(false)
  })

  test('open the logo if now during a specific period of time', async () => {
    const wrapper = createWrapper(ContainerHeader, {
      data() {
        return {
          now: new Date('Tue Jun 09 2020 18:30:00 GMT+0800'),
        }
      },
      mocks: {
        $fetchEvent: () =>
          Promise.resolve({
            items: [
              {
                startDate: 'Tue, 09 Jun 2020 10:00:00 GMT',
                endDate: 'Sun, 14 Jun 2020 10:00:00 GMT',
              },
            ],
          }),
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(UIEventLogo).exists()).toBe(true)

    await wrapper.setData({
      now: new Date('Tue Jun 09 2020 16:00:00 GMT+0800'),
    })
    expect(wrapper.findComponent(UIEventLogo).exists()).toBe(false)
  })
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
  test('open it when users click the menu icon', async () => {
    const wrapper = createWrapper(ContainerHeader, {
      mocks: {
        $ga: { event: jest.fn() },
      },
    })

    await wrapper.get('.menu-icon').trigger('click')
    expect(wrapper.findComponent(UISidebar).exists()).toBe(true)
  })

  test('close it when the UISidebar.vue emits a "close"', async () => {
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

  test('close it when the URL changes', async () => {
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
  test('call the $ga method when users click the menu icon', () => {
    const $ga = {
      event: jest.fn(),
    }
    const wrapper = createWrapper(ContainerHeader, {
      mocks: {
        $ga,
      },
    })

    wrapper.get('.menu-icon').trigger('click')
    expect($ga.event).toBeCalledWith({
      eventCategory: 'header',
      eventAction: 'click',
      eventLabel: 'menu open',
    })
  })

  test('call the $ga method when the UISidebar.vue emits a "close"', () => {
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

    wrapper.findComponent(UISidebar).vm.$emit('close')
    expect($ga.event).toBeCalledWith({
      eventCategory: 'header',
      eventAction: 'click',
      eventLabel: 'menu close',
    })
  })

  test('call the $ga method when users click the logo', () => {
    const $ga = {
      event: jest.fn(),
    }
    const wrapper = createWrapper(ContainerHeader, {
      mocks: {
        $ga,
      },
    })

    wrapper.get('[to="/"]').trigger('click')
    expect($ga.event).toBeCalledWith({
      eventCategory: 'header',
      eventAction: 'click',
      eventLabel: 'logo',
    })
  })
})

describe('handleSendGA method', () => {
  test('call the $ga method when the UIEventLogo.vue emits a "sendGA"', () => {
    const $ga = {
      event: jest.fn(),
    }
    const wrapper = createWrapper(ContainerHeader, {
      computed: {
        shouldOpenEventLogo: () => true,
      },
      mocks: {
        $ga,
      },
    })

    const gaArgs = {
      eventCategory: 'header',
      eventAction: 'click',
      eventLabel: 'logo event',
    }
    wrapper.findComponent(UIEventLogo).vm.$emit('sendGA', gaArgs)
    expect($ga.event).toBeCalledWith(gaArgs)
  })

  test('call the $ga method when the UISearchBarWrapper.vue emits a "sendGA"', () => {
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

  test('call the $ga method when the UIOthersList.vue emits a "sendGA"', () => {
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

  test('call the $ga method when the UIHeaderNavSection.vue emits a "sendGA"', () => {
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

  test('call the $ga method when the UIHeaderNavTopic.vue emits a "sendGA"', () => {
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

  test('call the $ga method when the UISidebar.vue emits a "sendGA"', () => {
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
})
