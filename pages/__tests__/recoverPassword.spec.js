import flushPromises from 'flush-promises'
import page from '../recoverPassword.vue'
import UiMembershipInputEmailInvalidation from '~/components/UiMembershipInputEmailInvalidation'
import UiMembershipButtonPrimary from '~/components/UiMembershipButtonPrimary.vue'
import UiMembershipLoadingIcon from '~/components/UiMembershipLoadingIcon.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'
import UiRecoverPasswordHints from '~/components/UiRecoverPasswordHints.vue'

const createWrapper = createWrapperHelper({
  mocks: {
    $fire: {
      auth: {
        fetchSignInMethodsForEmail: jest.fn(),
        sendPasswordResetEmail: jest.fn(),
      },
    },
  },
})

test('should not have global authenticate nuxt middleware in page component option, because this page never require login first', function () {
  const wrapper = createWrapper(page)
  expect(wrapper.vm.$options?.middleware ?? []).not.toContain('authenticate')
})

test('should enable submit button if we input something on email input', async function () {
  expect.assertions(1)
  const wrapper = createWrapper(page)
  const input = wrapper.getComponent(UiMembershipInputEmailInvalidation)
  input.vm.$emit('input', 'something')
  await wrapper.vm.$nextTick()
  expect(
    wrapper.getComponent(UiMembershipButtonPrimary).attributes().disabled
  ).not.toBe('true')
})

test('should enable the ability to show invalid hint in email input after we click the submit button', async function () {
  const wrapper = createWrapper(page)
  const input = wrapper.getComponent(UiMembershipInputEmailInvalidation)
  input.vm.$emit('input', 'something')
  wrapper.getComponent(UiMembershipButtonPrimary).trigger('click')
  await wrapper.vm.$nextTick()
  expect(input.props().shouldShowInvalidHint).toBe(true)
})

test('should call router back method if we click the back button', function () {
  const mockBack = jest.fn()
  const wrapper = createWrapper(page, {
    mocks: {
      $router: {
        back: mockBack,
      },
    },
  })
  const backButton = wrapper.get('.back-button')
  backButton.trigger('click')
  expect(mockBack).toHaveBeenCalled()
})

describe('behaviors after user click the submit button', function () {
  test('should show loading icon after user enter the valid email and click submit button', async function () {
    expect.assertions(1)
    const wrapper = createWrapper(page)
    const input = wrapper.getComponent(UiMembershipInputEmailInvalidation)
    input.vm.$emit('input', 'name@example.com')
    input.vm.$emit('inputValidStateChange', true)
    wrapper.getComponent(UiMembershipButtonPrimary).trigger('click')
    await wrapper.vm.$nextTick()
    expect(
      wrapper.getComponent(UiMembershipLoadingIcon).element.style.display
    ).not.toBe('none')
  })

  test('should show non-exist hint and register button after user enter the valid email and click submit button, but email was not exist', async function () {
    expect.assertions(2)
    const wrapper = createWrapper(page, {
      mocks: {
        $fire: {
          auth: {
            // resolve sign-in methods without email
            fetchSignInMethodsForEmail: jest.fn(() => Promise.resolve([''])),
          },
        },
      },
    })
    const input = wrapper.getComponent(UiMembershipInputEmailInvalidation)
    input.vm.$emit('input', 'name@example.com')
    input.vm.$emit('inputValidStateChange', true)
    wrapper.getComponent(UiMembershipButtonPrimary).trigger('click')
    await flushPromises()
    expect(wrapper.getComponent(UiRecoverPasswordHints).props().state).toBe(
      'emailNotExist'
    )

    delete window.location
    window.location = {
      assign: jest.fn(),
    }
    wrapper.get('.register-button').trigger('click')
    expect(window.location.assign).toBeCalledWith('/login')
  })

  test('should show success hint after user enter the valid email and click submit button, and email was exist', async function () {
    expect.assertions(1)
    const wrapper = createWrapper(page, {
      mocks: {
        $fire: {
          auth: {
            // resolve sign-in methods with email
            fetchSignInMethodsForEmail: jest.fn(() =>
              Promise.resolve(['emailLink'])
            ),
          },
        },
      },
    })
    const input = wrapper.getComponent(UiMembershipInputEmailInvalidation)
    input.vm.$emit('input', 'name@example.com')
    input.vm.$emit('inputValidStateChange', true)
    wrapper.getComponent(UiMembershipButtonPrimary).trigger('click')
    await flushPromises()
    expect(wrapper.getComponent(UiRecoverPasswordHints).props().state).toBe(
      'success'
    )
  })

  test('should show error hint after user enter the valid email and click submit button, but error occur by fetchSignInMethodsForEmail', async function () {
    expect.assertions(1)
    const wrapper = createWrapper(page, {
      mocks: {
        $fire: {
          auth: {
            fetchSignInMethodsForEmail: jest.fn(() =>
              Promise.reject(new Error('mock error'))
            ),
          },
        },
      },
    })
    const input = wrapper.getComponent(UiMembershipInputEmailInvalidation)
    input.vm.$emit('input', 'name@example.com')
    input.vm.$emit('inputValidStateChange', true)
    wrapper.getComponent(UiMembershipButtonPrimary).trigger('click')
    await flushPromises()
    expect(wrapper.getComponent(UiRecoverPasswordHints).props().state).toBe(
      'error'
    )
  })

  test('should show error hint after user enter the valid email and click submit button, but error occur by sendPasswordResetEmail', async function () {
    expect.assertions(1)
    const wrapper = createWrapper(page, {
      mocks: {
        $fire: {
          auth: {
            // resolve sign-in methods with email
            fetchSignInMethodsForEmail: jest.fn(() =>
              Promise.resolve(['emailLink'])
            ),
            sendPasswordResetEmail: jest.fn(() =>
              Promise.reject(new Error('mock error'))
            ),
          },
        },
      },
    })
    const input = wrapper.getComponent(UiMembershipInputEmailInvalidation)
    input.vm.$emit('input', 'name@example.com')
    input.vm.$emit('inputValidStateChange', true)
    wrapper.getComponent(UiMembershipButtonPrimary).trigger('click')
    await flushPromises()
    expect(wrapper.getComponent(UiRecoverPasswordHints).props().state).toBe(
      'error'
    )
  })

  test('should show success hint and disable submit button for 30 seconds after user enter the valid email and click submit button, and every function with firebase are fine', async function () {
    expect.assertions(3)
    jest.useFakeTimers()
    const wrapper = createWrapper(page, {
      mocks: {
        $fire: {
          auth: {
            // resolve sign-in methods with email
            fetchSignInMethodsForEmail: jest.fn(() =>
              Promise.resolve(['emailLink'])
            ),
            sendPasswordResetEmail: jest.fn(() => Promise.resolve()),
          },
        },
      },
    })
    const input = wrapper.getComponent(UiMembershipInputEmailInvalidation)
    input.vm.$emit('input', 'name@example.com')
    input.vm.$emit('inputValidStateChange', true)
    wrapper.getComponent(UiMembershipButtonPrimary).trigger('click')
    await flushPromises()
    expect(wrapper.getComponent(UiRecoverPasswordHints).props().state).toBe(
      'success'
    )
    expect(
      wrapper.getComponent(UiMembershipButtonPrimary).attributes().disabled
    ).toBe('true')
    jest.runTimersToTime(31000)
    await wrapper.vm.$nextTick()
    expect(
      wrapper.getComponent(UiMembershipButtonPrimary).attributes().disabled
    ).not.toBe('true')
  })
})
