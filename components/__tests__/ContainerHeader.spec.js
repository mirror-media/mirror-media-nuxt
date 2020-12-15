import ContainerHeader from '../ContainerHeader.vue'
import UiEventLogo from '../UiEventLogo.vue'
import ContainerGptAd from '../ContainerGptAd.vue'
import UiSearchBarWrapper from '../UiSearchBarWrapper.vue'
import UiPromotionList from '../UiPromotionList.vue'
import UiHeaderNavSection from '../UiHeaderNavSection.vue'
import UiHeaderNavTopic from '../UiHeaderNavTopic.vue'
import UiSidebar from '../UiSidebar.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  computed: {
    sections: () => [],
    gainSectionByCategoryName: () => () => ({
      name: undefined,
    }),
    partners: () => [],
    topics: () => [],
    isDesktopWidth: () => false,
  },
  mocks: {
    $fetchEvent: () => Promise.resolve({}),
    $route: { path: '/' },
  },
  stubs: ['ClientOnly'],
})

describe('fixed header', () => {
  test('disply the content when the header is fixed', async () => {
    expect.assertions(4)

    /* Arrange */
    const sut = createWrapper(ContainerHeader, {
      data() {
        return {
          hasGptLogo: true,
        }
      },
      computed: {
        shouldOpenEventLogo: () => true,
      },
    })

    await sut.vm.$nextTick()

    /* Assert */
    // display the fixed header style
    expect(sut.get('header').classes('fixed')).toBe(true)

    // hide the event logo
    expect(sut.getComponent(UiEventLogo).isVisible()).toBe(false)

    // hide the AD of RWD_LOGO
    expect(sut.getComponent(ContainerGptAd).isVisible()).toBe(false)

    // show the share icons
    expect(sut.find('.share-wrapper').exists()).toBe(true)

    /**
     * 以下的行為測不到，僅作為提醒：
     * display the small Mirror Media logo
     */
  })

  test('disply the content when the header is not fixed', () => {
    const sut = createWrapper(ContainerHeader, {
      data() {
        return {
          hasGptLogo: true,
        }
      },
      computed: {
        isDesktopWidth: () => true,
        shouldOpenEventLogo: () => true,
      },
    })

    // display the normal header style
    expect(sut.get('header').classes('fixed')).toBe(false)

    // show the event logo
    expect(sut.getComponent(UiEventLogo).isVisible()).toBe(true)

    // show the AD of RWD_LOGO
    expect(sut.getComponent(ContainerGptAd).isVisible()).toBe(true)

    // hide the share icons
    expect(sut.find('.share-wrapper').exists()).toBe(false)

    /**
     * 以下的行為測不到，僅作為提醒：
     * display the full Mirror Media logo
     */
  })
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

describe('hightlight a navbar item', () => {
  test('hightlight the section navbar item when users on the story page', () => {
    /* Arrange */
    const sectionNameMock = 'entertainment'
    const sut = createWrapper(ContainerHeader, {
      propsData: {
        currentSectionName: sectionNameMock,
      },
      mocks: {
        $route: { path: '/story/20200602pol001' },
      },
    })

    /* Assert */
    expect(
      sut.getComponent(UiHeaderNavSection).props().currentSectionName
    ).toBe(sectionNameMock)
  })

  test('hightlight the "home" navbar item when users on the homepage', () => {
    const sut = createWrapper(ContainerHeader)

    expect(
      sut.getComponent(UiHeaderNavSection).props().currentSectionName
    ).toBe('home')
  })

  test('hightlight the section navbar item when users on the section page', () => {
    /* Arrange */
    const sectionNameMock = 'entertainment'
    const sut = createWrapper(ContainerHeader, {
      mocks: {
        $route: { path: `/section/${sectionNameMock}` },
      },
    })

    /* Assert */
    expect(
      sut.getComponent(UiHeaderNavSection).props().currentSectionName
    ).toBe(sectionNameMock)
  })

  test('do not hightlight the section navbar item when users on the topic of section page', () => {
    const sut = createWrapper(ContainerHeader, {
      mocks: {
        $route: { path: '/section/topic' },
      },
    })

    expect(
      sut.getComponent(UiHeaderNavSection).props().currentSectionName
    ).toBeUndefined()
  })

  test('hightlight the section navbar item when users on the category page', () => {
    /* Arrange */
    const sectionNameMock = 'people'
    const sut = createWrapper(ContainerHeader, {
      computed: {
        gainSectionByCategoryName: () => () => ({
          name: sectionNameMock,
        }),
      },
      mocks: {
        $route: { path: '/category/somebody' },
      },
    })

    /* Assert */
    expect(
      sut.getComponent(UiHeaderNavSection).props().currentSectionName
    ).toBe(sectionNameMock)
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

  test('call the $ga method when the UiPromotionList.vue emits a "sendGa"', () => {
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
    wrapper.findComponent(UiPromotionList).vm.$emit('sendGa', gaArgs)
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
