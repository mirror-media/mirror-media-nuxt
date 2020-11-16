import ContainerHeader from '../ContainerHeader.vue'
import UiEventLogo from '../UiEventLogo.vue'
import ContainerGptAd from '../ContainerGptAd.vue'
import UiSearchBarWrapper from '../UiSearchBarWrapper.vue'
import UiOthersList from '../UiOthersList.vue'
import UiHeaderNavSection from '../UiHeaderNavSection.vue'
import UiHeaderNavTopic from '../UiHeaderNavTopic.vue'
import UiSidebar from '../UiSidebar.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  computed: {
    sections: () => [],
    sectionByCategoryName: () => () => ({
      name: undefined,
    }),
    partners: () => [],
    topics: () => [],
    isDesktopWidth: () => false,
  },
  mocks: {
    $fetchEvent: () => Promise.resolve({}),
    $store: {
      state: {
        sectionName: undefined,
      },
      commit: jest.fn(),
    },
  },
  stubs: ['client-only'],
})

describe('when the header is fixed', () => {
  test('display the fixed header', async () => {
    expect.assertions(1)

    /* Arrange */
    const sut = createWrapper(ContainerHeader)

    await sut.vm.$nextTick()

    /* Assert */
    expect(sut.get('header').classes('fixed')).toBe(true)
  })

  test('hide the event logo', async () => {
    expect.assertions(1)

    /* Arrange */
    const sut = createWrapper(ContainerHeader, {
      computed: {
        shouldOpenEventLogo: () => true,
      },
    })

    await sut.vm.$nextTick()

    /* Assert */
    expect(sut.getComponent(UiEventLogo).isVisible()).toBe(false)
  })

  test('hide the AD of RWD_LOGO', async () => {
    expect.assertions(1)

    /* Arrange */
    const sut = createWrapper(ContainerHeader, {
      data() {
        return {
          hasGptLogo: true,
        }
      },
    })

    await sut.vm.$nextTick()

    /* Assert */
    expect(sut.getComponent(ContainerGptAd).isVisible()).toBe(false)
  })

  test('show the share icons', async () => {
    expect.assertions(1)

    /* Arrange */
    const sut = createWrapper(ContainerHeader)

    await sut.vm.$nextTick()

    /* Assert */
    expect(sut.find('.share-wrapper').exists()).toBe(true)
  })

  /**
   * 測不到這個行為，僅作為提醒
   * test('display the small Mirror Media logo')
   */
})

describe('when the header is not fixed', () => {
  test('display the normal header', () => {
    const sut = createWrapper(ContainerHeader, {
      computed: {
        isDesktopWidth: () => true,
      },
    })

    expect(sut.get('header').classes('fixed')).toBe(false)
  })

  test('show the event logo', () => {
    const sut = createWrapper(ContainerHeader, {
      computed: {
        isDesktopWidth: () => true,
        shouldOpenEventLogo: () => true,
      },
    })

    expect(sut.getComponent(UiEventLogo).isVisible()).toBe(true)
  })

  test('show the AD of RWD_LOGO', () => {
    const sut = createWrapper(ContainerHeader, {
      data() {
        return {
          hasGptLogo: true,
        }
      },
      computed: {
        isDesktopWidth: () => true,
      },
    })

    expect(sut.getComponent(ContainerGptAd).isVisible()).toBe(true)
  })

  test('hide the share icons', () => {
    const sut = createWrapper(ContainerHeader, {
      computed: {
        isDesktopWidth: () => true,
      },
    })

    expect(sut.find('.share-wrapper').exists()).toBe(false)
  })

  /**
   * 測不到這個行為，僅作為提醒
   * test('display the full Mirror Media logo')
   */
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
    expect(wrapper.findComponent(UiEventLogo).exists()).toBe(false)
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
    expect(wrapper.findComponent(UiEventLogo).exists()).toBe(true)

    await wrapper.setData({
      now: new Date('Tue Jun 09 2020 16:00:00 GMT+0800'),
    })
    expect(wrapper.findComponent(UiEventLogo).exists()).toBe(false)
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
    expect(wrapper.findComponent(UiSidebar).exists()).toBe(true)
  })

  test('close it when the UiSidebar.vue emits a "close"', async () => {
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

    wrapper.findComponent(UiSidebar).vm.$emit('close')
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(UiSidebar).exists()).toBe(false)
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
    expect(wrapper.findComponent(UiSidebar).exists()).toBe(false)
  })
})

describe('setSectionName', () => {
  test('commit with a "home" argument when users stay on the home page', () => {
    const $store = {
      commit: jest.fn(),
    }
    createWrapper(ContainerHeader, {
      mocks: {
        $route: { path: '/' },
        $store,
      },
    })

    expect($store.commit).toBeCalledWith('setSectionName', 'home')
  })

  test('commit with a proper argument when users stay on the section page', () => {
    const $store = {
      commit: jest.fn(),
    }
    const mockSectionName = 'entertainment'
    createWrapper(ContainerHeader, {
      mocks: {
        $route: { path: `/section/${mockSectionName}` },
        $store,
      },
    })

    expect($store.commit).toBeCalledWith('setSectionName', mockSectionName)
  })

  test('commit with a proper argument when users stay on the category page', () => {
    const $store = {
      commit: jest.fn(),
    }
    const mockSectionName = 'people'
    createWrapper(ContainerHeader, {
      computed: {
        sectionByCategoryName: () => () => ({
          name: mockSectionName,
        }),
      },
      mocks: {
        $route: { path: '/category/somebody' },
        $store,
      },
    })

    expect($store.commit).toBeCalledWith('setSectionName', mockSectionName)
  })

  test('do not commit when users stay on the story page', () => {
    const $store = {
      commit: jest.fn(),
    }
    createWrapper(ContainerHeader, {
      mocks: {
        $route: { path: '/story/20200602pol001' },
        $store,
      },
    })

    expect($store.commit).not.toBeCalled()
  })

  test('do not commit when users stay on the section of topic page', () => {
    const $store = {
      commit: jest.fn(),
    }
    createWrapper(ContainerHeader, {
      mocks: {
        $route: { path: '/section/topic' },
        $store,
      },
    })

    expect($store.commit).not.toBeCalled()
  })

  test('commit with a proper argument when users go to other pages', async () => {
    const $store = {
      commit: jest.fn(),
    }
    const wrapper = createWrapper(ContainerHeader, {
      mocks: {
        $route: { path: '/' },
        $store,
      },
    })

    const mockSectionName = 'news'
    wrapper.vm.$route.path = `/section/${mockSectionName}`
    await wrapper.vm.$nextTick()
    expect($store.commit).toBeCalledWith('setSectionName', mockSectionName)
  })
})

describe('Ga event', () => {
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

  test('call the $ga method when the UiSidebar.vue emits a "close"', () => {
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

    wrapper.findComponent(UiSidebar).vm.$emit('close')
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

    wrapper.get('[href="/"]').trigger('click')
    expect($ga.event).toBeCalledWith({
      eventCategory: 'header',
      eventAction: 'click',
      eventLabel: 'logo',
    })
  })
})

describe('handleSendGa method', () => {
  test('call the $ga method when the UiEventLogo.vue emits a "sendGa"', () => {
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
    wrapper.findComponent(UiEventLogo).vm.$emit('sendGa', gaArgs)
    expect($ga.event).toBeCalledWith(gaArgs)
  })

  test('call the $ga method when the UiSearchBarWrapper.vue emits a "sendGa"', () => {
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
    wrapper.findComponent(UiSearchBarWrapper).vm.$emit('sendGa', gaArgs)
    expect($ga.event).toBeCalledWith(gaArgs)
  })

  test('call the $ga method when the UiOthersList.vue emits a "sendGa"', () => {
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
    wrapper.findComponent(UiOthersList).vm.$emit('sendGa', gaArgs)
    expect($ga.event).toBeCalledWith(gaArgs)
  })

  test('call the $ga method when the UiHeaderNavSection.vue emits a "sendGa"', () => {
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
    wrapper.findComponent(UiHeaderNavSection).vm.$emit('sendGa', gaArgs)
    expect($ga.event).toBeCalledWith(gaArgs)
  })

  test('call the $ga method when the UiHeaderNavTopic.vue emits a "sendGa"', () => {
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
    wrapper.findComponent(UiHeaderNavTopic).vm.$emit('sendGa', gaArgs)
    expect($ga.event).toBeCalledWith(gaArgs)
  })

  test('call the $ga method when the UiSidebar.vue emits a "sendGa"', () => {
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
    wrapper.findComponent(UiSidebar).vm.$emit('sendGa', gaArgs)
    expect($ga.event).toBeCalledWith(gaArgs)
  })
})
