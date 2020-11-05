import localforage from 'localforage'

import TheGdpr from '../TheGdpr.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper.js'

const createWrapper = createWrapperHelper({
  stubs: ['transition'],
})

describe('GDPR', () => {
  test('should not render content by default', () => {
    const wrapper = createWrapper(TheGdpr)

    expect(wrapper.find('.the-gdpr').exists()).toBe(false)
  })

  test('should render content if data shouldOpenGdpr is true', () => {
    const wrapper = createWrapper(TheGdpr, {
      data() {
        return {
          shouldOpenGdpr: true,
        }
      },
    })

    expect(wrapper.find('.the-gdpr').exists()).toBe(true)
  })

  test('close GDPR when users click close button', async () => {
    const spyGetItem = jest
      .spyOn(localforage, 'getItem')
      .mockImplementation(() => Promise.resolve(JSON.stringify(true)))

    const wrapper = createWrapper(TheGdpr)

    await wrapper.vm.$nextTick()

    await wrapper.get('button').trigger('click')

    expect(wrapper.find('.the-gdpr').exists()).toBe(false)

    spyGetItem.mockRestore()
  })
})
