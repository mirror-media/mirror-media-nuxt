import UIEventLogo from '../UIEventLogo.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const mockEventLogo = {
  link: 'https://www.pubu.com.tw/store/2775997',
  image: {
    image: {
      resizedTargets: {
        mobile: {
          url:
            'https://storage.googleapis.com/mirrormedia-files/assets/images/20200505103510-bd1a428fe1306868ad92ef07db39b12e-mobile.gif',
        },
      },
    },
  },
  name: '泰山油LOGO',
}

const createWrapper = createWrapperHelper({
  propsData: {
    eventLogo: mockEventLogo,
  },
})

describe('event logo', () => {
  test('render the proper content', () => {
    const wrapper = createWrapper(UIEventLogo)

    const eventLogo = wrapper.get(`[href="${mockEventLogo.link}"]`)
    const eventLogoImg = eventLogo.get('img')
    expect(eventLogoImg.attributes().src).toBe(wrapper.vm.eventLogoImage)
    expect(eventLogoImg.attributes().alt).toBe(mockEventLogo.name)
  })
})

describe('emitGA method', () => {
  test('with a proper argument when users click the event logo', () => {
    const wrapper = createWrapper(UIEventLogo)

    wrapper.get(`[href="${mockEventLogo.link}"]`).trigger('click')
    expect(wrapper.emitted().sendGA[0]).toEqual([
      {
        eventCategory: 'header',
        eventAction: 'click',
        eventLabel: 'logo event',
      },
    ])
  })
})
