import ContainerFullScreenAds from '../ContainerFullScreenAds.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  stubs: ['client-only'],
})

describe('computed', () => {
  test('should has proper hasFullScreenAd computed value', () => {
    const wrapper = createWrapper(ContainerFullScreenAds, {
      data() {
        return {
          hasAdFirst: true,
        }
      },
    })
    expect(wrapper.vm.hasFullScreenAd).toBe(true)
  })
  test('should has proper hasAdThirdOrFourth computed value', () => {
    const wrapper = createWrapper(ContainerFullScreenAds, {
      data() {
        return {
          hasAdThird: true,
        }
      },
    })
    expect(wrapper.vm.hasAdThirdOrFourth).toBe(true)
  })
})
