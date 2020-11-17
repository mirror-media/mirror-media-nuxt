import { shallowMount } from '@vue/test-utils'
import ContainerMembershipLoginWithGoogle from '~/components/ContainerMembershipLoginWithGoogle.vue'

test('should call $fire.auth.signInWithRedirect with GoogleAuthProvider instance after component clicked', async function () {
  const mockFireModule = {
    auth: {
      GoogleAuthProvider: jest.fn(),
    },
  }
  const mockFire = {
    auth: {
      signInWithRedirect: jest.fn(),
    },
  }
  const wrapper = shallowMount(ContainerMembershipLoginWithGoogle, {
    mocks: {
      $fire: mockFire,
      $fireModule: mockFireModule,
    },
  })
  await wrapper.trigger('click')
  expect(mockFire.auth.signInWithRedirect).toHaveBeenCalled()
  expect(mockFire.auth.signInWithRedirect.mock.calls[0][0]).toBeInstanceOf(
    mockFireModule.auth.GoogleAuthProvider
  )
})
