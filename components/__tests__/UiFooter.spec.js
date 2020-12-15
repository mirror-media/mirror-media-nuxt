import UiFooter from '../UiFooter.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper()

describe('promotion nav', () => {
  const promotionMock = {
    name: 'subscribe',
    title: '訂閱鏡週刊',
    href:
      'https://docs.google.com/forms/d/1es1wqWfhwJn2sxDLc-6NRVokGn_fU0_M2YffhKMlcyM/viewform',
  }

  test('render the proper promotion link', () => {
    const wrapper = createWrapper(UiFooter, {
      computed: {
        promotions() {
          return [promotionMock]
        },
      },
    })

    expect(wrapper.get(`[href="${promotionMock.href}"]`).text()).toBe(
      promotionMock.title
    )
  })

  test('call $ga method when users click a promotion link', () => {
    const $ga = {
      event: jest.fn(),
    }
    const wrapper = createWrapper(UiFooter, {
      computed: {
        promotions() {
          return [promotionMock]
        },
      },
      mocks: {
        $ga,
      },
    })

    const gaArgs = {
      eventCategory: 'footer',
      eventAction: 'click',
      eventLabel: `more ${promotionMock.name}`,
    }
    wrapper.get(`[href="${promotionMock.href}"]`).trigger('click')
    expect($ga.event).toBeCalledWith(gaArgs)
  })
})

describe('social media nav', () => {
  const mockSocialMedia = {
    name: 'line',
    href: 'https://line.me/R/ti/p/%40cuk1273e',
  }

  test('render the proper social media link', () => {
    const wrapper = createWrapper(UiFooter, {
      computed: {
        socialMedia() {
          return [mockSocialMedia]
        },
      },
    })

    const socialMediaLink = wrapper.get(`[href="${mockSocialMedia.href}"]`)
    expect(socialMediaLink.get('img').attributes().alt).toBe(
      mockSocialMedia.name
    )
  })

  test('call $ga method when users click a social media link', () => {
    const $ga = {
      event: jest.fn(),
    }
    const wrapper = createWrapper(UiFooter, {
      computed: {
        socialMedia() {
          return [mockSocialMedia]
        },
      },
      mocks: {
        $ga,
      },
    })

    const gaArgs = {
      eventCategory: 'footer',
      eventAction: 'click',
      eventLabel: `social ${mockSocialMedia.name}`,
    }
    const socialMediaLink = wrapper.get(`[href="${mockSocialMedia.href}"]`)
    socialMediaLink.trigger('click')
    expect($ga.event).toBeCalledWith(gaArgs)
  })
})
