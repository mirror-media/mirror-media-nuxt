import FbPage from '../FbPage.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper.js'

const createWrapper = createWrapperHelper()

test('has the class name "fb-page"', () => {
  const wrapper = createWrapper(FbPage)

  expect(wrapper.find('.fb-page').exists()).toBe(true)
})

describe('settings', () => {
  test('has default settings', () => {
    const wrapper = createWrapper(FbPage)

    const fbPageAttrs = wrapper.get('.fb-page').attributes()

    expect(fbPageAttrs['data-href']).toBe(
      'https://www.facebook.com/mirrormediamg'
    )
    expect(fbPageAttrs['data-tabs']).toBe('timeline')
    expect(fbPageAttrs['data-show-facepile']).toBe('false')
    expect(fbPageAttrs['data-lazy']).toBe('true')
  })

  test('merged with the prop "settings"', () => {
    const mockSettings = {
      'data-show-facepile': 'true',
      'data-small-header': 'true',
    }

    const wrapper = createWrapper(FbPage, {
      propsData: { settings: mockSettings },
    })

    const fbPageAttrs = wrapper.get('.fb-page').attributes()

    expect(fbPageAttrs['data-show-facepile']).toBe(
      mockSettings['data-show-facepile']
    )
    expect(fbPageAttrs['data-small-header']).toBe(
      mockSettings['data-small-header']
    )
  })
})
