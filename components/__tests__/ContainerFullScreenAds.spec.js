import ContainerFullScreenAds from '../ContainerFullScreenAds.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  mocks: {
    $route: {
      query: {},
    },
  },
  stubs: ['client-only', 'GPTAD'],
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
  test('should has proper hasAdSecondOrThird computed value', () => {
    const wrapper = createWrapper(ContainerFullScreenAds, {
      data() {
        return {
          hasAdSecond: true,
        }
      },
    })
    expect(wrapper.vm.hasAdSecondOrThird).toBe(true)
  })
})
