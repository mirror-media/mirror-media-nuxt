import UIStickyAd from '../UIStickyAd.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  mocks: {
    $ua: {
      isFromPc() {
        return false
      },
    },
  },
})

describe('visible', () => {
  const wrapper = createWrapper(UIStickyAd)
  test('sticky ad is invisible by default', () => {
    expect(wrapper.get('.sticky-ad').element.style.display).toBe('none')
  })
  test('sticky ad is visible when triggering scroll event', () => {
    window.dispatchEvent(new Event('scroll'))
    expect(wrapper.vm.isVisible).toBe(true)
  })
})
