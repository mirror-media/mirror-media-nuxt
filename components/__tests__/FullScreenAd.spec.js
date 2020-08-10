import UIFullScreenAd from '../UIFullScreenAd.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper()

describe('props', () => {
  test('should has proper class name and close button when props hasDefaultStyle is true', () => {
    const wrapper = createWrapper(UIFullScreenAd, {
      propsData: {
        hasDefaultStyle: true,
      },
    })
    const ad = wrapper.get('.full-screen-ad')
    expect(ad.classes('default')).toBe(true)

    const closeBtn = wrapper.find('button')
    expect(closeBtn.exists()).toBe(true)
  })
  test('should has proper class name and close button when props hasModifiedStyle is true', () => {
    const wrapper = createWrapper(UIFullScreenAd, {
      propsData: {
        hasModifiedStyle: true,
      },
    })
    const ad = wrapper.get('.full-screen-ad')
    expect(ad.classes('modified')).toBe(true)
  })
})

describe('data', () => {
  test('should not exist when isEnabled is false', () => {
    const wrapper = createWrapper(UIFullScreenAd, {
      data() {
        return {
          isEnabled: false,
        }
      },
    })
    expect(wrapper.find('.full-screen-ad').exists()).toBe(false)
  })
})

describe('methods', () => {
  test('should not exist when click close button', async () => {
    const wrapper = createWrapper(UIFullScreenAd, {
      propsData: {
        hasDefaultStyle: true,
      },
    })
    await wrapper.get('button').trigger('click')
    expect(wrapper.find('.full-screen-ad').exists()).toBe(false)
  })
})
