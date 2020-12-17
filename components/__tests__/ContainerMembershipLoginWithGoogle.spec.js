import { shallowMount } from '@vue/test-utils'
import localforage from 'localforage'
import ContainerMembershipLoginWithGoogle from '~/components/ContainerMembershipLoginWithGoogle.vue'

test('should call $fire.auth.signInWithRedirect with GoogleAuthProvider instance after component clicked', async function () {
  const mockDestination = '/mock/destination'
  const mockRoute = {
    query: {
      destination: mockDestination,
    },
  }
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
  const spySetItem = jest
    .spyOn(localforage, 'setItem')
    .mockImplementation(() => {})

  const wrapper = shallowMount(ContainerMembershipLoginWithGoogle, {
    mocks: {
      $route: mockRoute,
      $fire: mockFire,
      $fireModule: mockFireModule,
    },
  })
  await wrapper.trigger('click')
  expect(mockFire.auth.signInWithRedirect).toHaveBeenCalled()
  expect(mockFire.auth.signInWithRedirect.mock.calls[0][0]).toBeInstanceOf(
    mockFireModule.auth.GoogleAuthProvider
  )
  expect(spySetItem).toBeCalledWith('mm-login-destination', mockDestination)
})
