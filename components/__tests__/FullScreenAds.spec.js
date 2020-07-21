import FullScreenAds from '../FullScreenAds.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  stubs: ['client-only', 'GPTAD'],
})

describe('computed', () => {
  test('should has proper hasFullScreenAd computed value', () => {
    const wrapper = createWrapper(FullScreenAds, {
      data() {
        return {
          hasAdFirst: true,
        }
      },
    })
    expect(wrapper.vm.hasFullScreenAd).toBe(true)
  })
  test('should has proper hasAdSecondOrThird computed value', () => {
    const wrapper = createWrapper(FullScreenAds, {
      data() {
        return {
          hasAdSecond: true,
        }
      },
    })
    expect(wrapper.vm.hasAdSecondOrThird).toBe(true)
  })
})
