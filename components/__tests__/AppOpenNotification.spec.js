import AppOpenNotification from '../AppOpenNotification.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper.js'

const createWrapper = createWrapperHelper({
  mocks: {
    $ua: {
      isFromPc: () => false,
    },
  },
  stubs: ['ClientOnly'],
})

test('do not show the notification when users click the close icon', async () => {
  expect.assertions(1)

  /* Arrange */
  const sut = createWrapper(AppOpenNotification)

  /* Act */
  await sut.get('.close').trigger('click')

  /* Assert */
  expect(sut.find('.app-open-notification').exists()).toBe(false)
})

test("do not show the notification if a user's device is PC", () => {
  const sut = createWrapper(AppOpenNotification, {
    mocks: {
      $ua: {
        isFromPc: () => true,
      },
    },
  })

  expect(sut.find('.app-open-notification').exists()).toBe(false)
})
