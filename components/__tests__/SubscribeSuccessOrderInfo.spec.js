import { shallowMount } from '@vue/test-utils'
import SubscribeSuccessOrderInfo from '~/components/SubscribeSuccessOrderInfo.vue'

describe('customInfo props', function () {
  test('should hide custom info if all the values in customInfo are falsy', function () {
    const wrapper = shallowMount(SubscribeSuccessOrderInfo, {
      propsData: {
        customerInfo: {
          every: '',
          value: '',
          are: '',
          falsy: '',
        },
      },
    })
    expect(wrapper.find('.order-info__user').exists()).toBe(false)
  })
  test('should show custom info if one of the values in customInfo is not falsy', function () {
    const wrapper = shallowMount(SubscribeSuccessOrderInfo, {
      propsData: {
        customerInfo: {
          every: '',
          value: '',
          are: '',
          falsy: '',
          expect: '',
          thisOne: 'mock value',
        },
      },
    })
    expect(wrapper.find('.order-info__user').exists()).toBe(true)
  })
})
