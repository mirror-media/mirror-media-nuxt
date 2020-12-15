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
      data() {
        return {
          PROMOTION_LINKS: [promotionMock],
        }
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
      data() {
        return {
          PROMOTION_LINKS: [promotionMock],
        }
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
  const socialMediaMock = {
    name: 'line',
    href: 'https://line.me/R/ti/p/%40cuk1273e',
  }

  test('render the proper social media link', () => {
    const wrapper = createWrapper(UiFooter, {
      data() {
        return {
          SOCIAL_MEDIA_LINKS: [socialMediaMock],
        }
      },
    })

    const socialMediaLink = wrapper.get(`[href="${socialMediaMock.href}"]`)
    expect(socialMediaLink.get('img').attributes().alt).toBe(
      socialMediaMock.name
    )
  })

  test('call $ga method when users click a social media link', () => {
    const $ga = {
      event: jest.fn(),
    }
    const wrapper = createWrapper(UiFooter, {
      data() {
        return {
          SOCIAL_MEDIA_LINKS: [socialMediaMock],
        }
      },
      mocks: {
        $ga,
      },
    })

    const gaArgs = {
      eventCategory: 'footer',
      eventAction: 'click',
      eventLabel: `social ${socialMediaMock.name}`,
    }
    const socialMediaLink = wrapper.get(`[href="${socialMediaMock.href}"]`)
    socialMediaLink.trigger('click')
    expect($ga.event).toBeCalledWith(gaArgs)
  })
})
