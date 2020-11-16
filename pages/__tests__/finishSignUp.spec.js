import createWrapperHelper from '@/test/helpers/createWrapperHelper'
import localforage from 'localforage'
import flushPromises from 'flush-promises'
import page from '../finishSignUp.vue'
import UiMembershipError from '~/components/UiMembershipError.vue'
import UiMembershipEmailInput from '~/components/UiMembershipEmailInput.vue'

const createWrapper = createWrapperHelper({
  mocks: {
    $router: {
      replace: () => {},
    },
    $fire: {
      authReady: jest.fn(() => Promise.resolve()),
      auth: {
        setPersistence: jest.fn(() => Promise.resolve()),
        signInWithEmailLink: jest.fn(() => Promise.resolve()),
      },
    },
  },
})

describe('isSignInWithEmailLink middleware', function () {
  test('should redirect to home page if $fire.auth.isSignInWithEmailLink return false', async function () {
    expect.assertions(1)
    const wrapper = createWrapper(page)
    const middleware = wrapper.vm.$options.middleware
    const mockApp = {
      $fire: {
        authReady: jest.fn(() => Promise.resolve()),
        auth: {
          isSignInWithEmailLink() {
            return false
          },
        },
      },
    }
    const mockRedirect = jest.fn()
    const mockReq = {
      protocal: 'http',
      get() {
        return 'example'
      },
      originalUrl: '/finishSignUp',
    }
    await middleware({ app: mockApp, redirect: mockRedirect, req: mockReq })
    expect(mockRedirect).toHaveBeenCalledWith('/')
  })
})

describe('email validations', function () {
  test('should show ".confirm-email-form-wrapper" if we cannot find email for sign in in the storage of device', async function () {
    expect.assertions(1)
    jest.spyOn(localforage, 'getItem').mockImplementation(() => {})
    const wrapper = createWrapper(page)
    await flushPromises()
    expect(wrapper.find('.confirm-email-form-wrapper').exists()).toBe(true)
  })

  test('should show ".confirm-email-error-wrapper" if $fire.auth.signInWithEmailLink been rejected', async function () {
    expect.assertions(2)
    jest.spyOn(localforage, 'getItem').mockImplementation(() => {})
    const mockRouter = {
      replace: jest.fn(),
    }
    const wrapper = createWrapper(page, {
      mocks: {
        $router: mockRouter,
        $route: {
          query: {},
        },
        $fire: {
          auth: {
            signInWithEmailLink: jest.fn(() =>
              Promise.reject(new Error('mock error'))
            ),
          },
        },
      },
    })
    await flushPromises()
    const emailInput = wrapper.findComponent(UiMembershipEmailInput)
    const mockEmail = 'example@example.com'
    await emailInput.vm.$emit('input', mockEmail)
    await emailInput.vm.$emit('inputValidStateChange', true)
    const submitButton = wrapper.find('.login-button')
    await submitButton.trigger('click')
    await flushPromises()
    expect(wrapper.find('.confirm-email-error-wrapper').exists()).toBe(true)
    const errorWrapper = wrapper.findComponent(UiMembershipError)
    errorWrapper.vm.$emit('backToForm')
    expect(mockRouter.replace).toHaveBeenCalledWith('/login')
  })

  test('should sign in with firebase successfully and redirect to home page if we can find email for sign in in the storage of device', async function () {
    const mockEmail = 'example@example.com'
    jest.spyOn(localforage, 'getItem').mockImplementation(() => mockEmail)
    const spyRemoveItem = jest
      .spyOn(localforage, 'removeItem')
      .mockImplementation(() => {})
    const mockRouter = {
      replace: jest.fn(),
    }
    const mockSignInWithEmailLink = jest.fn(() => Promise.resolve())
    createWrapper(page, {
      mocks: {
        $router: mockRouter,
        $route: {
          query: {},
        },
        $fire: {
          auth: {
            signInWithEmailLink: mockSignInWithEmailLink,
          },
        },
      },
    })
    await flushPromises()
    expect(mockSignInWithEmailLink.mock.calls[0][0]).toBe(mockEmail)
    expect(spyRemoveItem).toHaveBeenCalledWith('emailForSignIn')
    expect(mockRouter.replace).toHaveBeenCalledWith('/')
  })
})

describe('firebase auth persistence', function () {
  test('should set the firebase auth persistence with "local" if "shouldRememberMe" query is "true"', async function () {
    const mockSetPersistence = jest.fn(() => Promise.resolve())
    createWrapper(page, {
      mocks: {
        $route: {
          query: {
            shouldRememberMe: 'true',
          },
        },
        $fire: {
          auth: {
            setPersistence: mockSetPersistence,
          },
        },
      },
    })
    await flushPromises()
    expect(mockSetPersistence).toHaveBeenCalledWith('local')
  })

  test('should set the firebase auth persistence with "session" if "shouldRememberMe" query is missing', async function () {
    const mockSetPersistence = jest.fn(() => Promise.resolve())
    createWrapper(page, {
      mocks: {
        $route: {
          query: {},
        },
        $fire: {
          auth: {
            setPersistence: mockSetPersistence,
          },
        },
      },
    })
    await flushPromises()
    expect(mockSetPersistence).toHaveBeenCalledWith('session')
  })
})
