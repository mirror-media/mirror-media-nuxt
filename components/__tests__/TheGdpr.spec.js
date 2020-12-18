import localforage from 'localforage'
import flushPromises from 'flush-promises'

import TheGdpr from '../TheGdpr.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper.js'

const createWrapper = createWrapperHelper({
  stubs: ['transition'],
})

describe('GDPR', () => {
  test('close the GDPR and prevent users from seeing it in the future when users click the close button', async () => {
    jest
      .spyOn(localforage, 'getItem')
      .mockImplementation((key) =>
        Promise.resolve(
          key === 'mmShouldOpenGdpr' ? null : JSON.stringify(false)
        )
      )
    const spySetItem = jest.spyOn(localforage, 'setItem')

    const wrapper = createWrapper(TheGdpr)

    await flushPromises()

    await wrapper.get('button').trigger('click')

    expect(wrapper.find('.the-gdpr').exists()).toBe(false)
    expect(spySetItem).toBeCalledWith('mmShouldOpenGdpr', JSON.stringify(false))

    jest.restoreAllMocks()
  })

  test('do not show the GDPR if users have closed it', async function () {
    expect.assertions(1)

    /* Arrange */
    jest
      .spyOn(localforage, 'getItem')
      .mockImplementation((key) =>
        Promise.resolve(JSON.stringify(key !== 'mmShouldOpenGdpr'))
      )

    const sut = createWrapper(TheGdpr)

    await flushPromises()

    /* Assert */
    expect(sut.find('.the-gdpr').exists()).toBe(false)

    jest.restoreAllMocks()
  })
})
