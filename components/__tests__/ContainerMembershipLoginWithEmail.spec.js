import flushPromises from 'flush-promises'
import UiMembershipEmailInput from '@/components/UiMembershipEmailInput.vue'
import localforage from 'localforage'
import UiMembershipEmailError from '@/components/UiMembershipEmailError.vue'
import ContainerMembershipLoginWithEmail from '../ContainerMembershipLoginWithEmail.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  mocks: {
    $fire: {
      authReady: jest.fn(),
    },
  },
})

describe('handle event emitted by child component UiMembershipEmailInput', function () {
  test('handle "input" event emitted by UiMembershipEmailInput', function () {
    const wrapper = createWrapper(ContainerMembershipLoginWithEmail)
    const emailInput = wrapper.findComponent(UiMembershipEmailInput)
    const mockInputValue = 'mockInputValue'
    emailInput.vm.$emit('input', mockInputValue)
    expect(wrapper.vm.emailInput).toBe(mockInputValue)
  })
  test('handle "inputValidStateChange" event emitted by UiMembershipEmailInput', function () {
    const wrapper = createWrapper(ContainerMembershipLoginWithEmail)
    const emailInput = wrapper.findComponent(UiMembershipEmailInput)
    const mockEmailInputValidState = true
    emailInput.vm.$emit('inputValidStateChange', mockEmailInputValidState)
    expect(wrapper.vm.isEmailInputValid).toBe(mockEmailInputValidState)
  })
})

describe('@nuxtjs/firebase service', function () {
  test('should lazyload @nuxtjs/firebase auth service on component created', async function () {
    expect.assertions(1)
    const mockAuthReady = jest.fn()
    createWrapper(ContainerMembershipLoginWithEmail, {
      mocks: {
        $fire: {
          authReady: mockAuthReady,
        },
      },
    })
    await flushPromises()
    expect(mockAuthReady).toHaveBeenCalled()
  })
})

describe('handleSubmit method about behaviours after login button clicked', function () {
  test('should not send finish-sign-in link to email through @nuxtjs/firebase if email input is empty, but show the invalid hint in child component UiMembershipEmailInput', async function () {
    expect.assertions(2)
    const mockSendSignInLinkToEmail = jest.fn()
    const wrapper = createWrapper(ContainerMembershipLoginWithEmail, {
      mocks: {
        $fire: {
          auth: {
            sendSignInLinkToEmail: mockSendSignInLinkToEmail,
          },
        },
      },
    })
    const submitButton = wrapper.find('.login-button')
    await submitButton.trigger('click')
    const emailInput = wrapper.findComponent(UiMembershipEmailInput)
    expect(emailInput.props().shouldShowInvalidHint).toBe(true)
    expect(mockSendSignInLinkToEmail).not.toHaveBeenCalled()
  })
  test(`should
    show invalid hint in UiMembershipEmailInput,
    send finish-sign-in link to email through @nuxtjs/firebase,
    store the email using localforage,
    hide form and show the success hint in /login page
    if email input is valid and @nuxtjs/firebase auth request send successfully
  `, async function () {
    expect.assertions(6)
    const mockSendSignInLinkToEmail = jest.fn(() => Promise.resolve())
    const spySetItem = jest
      .spyOn(localforage, 'setItem')
      .mockImplementation(() => {})
    const mockOrigin = 'http://mockOrigin'
    Object.defineProperty(window, 'location', {
      value: {
        origin: mockOrigin,
      },
    })
    const wrapper = createWrapper(ContainerMembershipLoginWithEmail, {
      mocks: {
        $fire: {
          auth: {
            sendSignInLinkToEmail: mockSendSignInLinkToEmail,
          },
        },
      },
    })
    const emailInput = wrapper.findComponent(UiMembershipEmailInput)
    const mockEmail = 'example@example.com'
    await emailInput.vm.$emit('input', mockEmail)
    await emailInput.vm.$emit('inputValidStateChange', true)
    const submitButton = wrapper.find('.login-button')
    await submitButton.trigger('click')
    expect(emailInput.props().shouldShowInvalidHint).toBe(true)
    expect(mockSendSignInLinkToEmail.mock.calls[0][0]).toBe(mockEmail)
    expect(mockSendSignInLinkToEmail.mock.calls[0][1].url).toBe(
      `${mockOrigin}/finishSignUp`
    )
    expect(spySetItem).toHaveBeenCalledWith('emailForSignIn', mockEmail)
    await flushPromises()
    expect(wrapper.find('.login-form-wrapper').exists()).toBe(false)
    expect(wrapper.find('.login-success-wrapper').exists()).toBe(true)
  })
  test('should append "shouldRememberMe=true" query to sign in link to email if .remember-me-checkbox was checked', async function () {
    expect.assertions(1)
    const mockSendSignInLinkToEmail = jest.fn(() => Promise.resolve())
    jest.spyOn(localforage, 'setItem').mockImplementation(() => {})
    const mockOrigin = 'http://mockOrigin'
    Object.defineProperty(window, 'location', {
      value: {
        origin: mockOrigin,
      },
    })
    const wrapper = createWrapper(ContainerMembershipLoginWithEmail, {
      mocks: {
        $fire: {
          auth: {
            sendSignInLinkToEmail: mockSendSignInLinkToEmail,
          },
        },
      },
    })
    const emailInput = wrapper.findComponent(UiMembershipEmailInput)
    const mockEmail = 'example@example.com'
    await emailInput.vm.$emit('input', mockEmail)
    await emailInput.vm.$emit('inputValidStateChange', true)
    const rememberMeCheckbox = wrapper.find('.remember-me-checkbox')
    await rememberMeCheckbox.trigger('click')
    const submitButton = wrapper.find('.login-button')
    await submitButton.trigger('click')
    expect(mockSendSignInLinkToEmail.mock.calls[0][1].url).toBe(
      `${mockOrigin}/finishSignUp?shouldRememberMe=true`
    )
  })
  test(`should
    show error hint,
    be able to get back to the form in error hint
    if we encounter some error after @nuxjs/firebase auth request
  `, async function () {
    expect.assertions(4)
    const mockSendSignInLinkToEmail = jest.fn(() =>
      Promise.reject(new Error('mock error'))
    )
    const wrapper = createWrapper(ContainerMembershipLoginWithEmail, {
      mocks: {
        $fire: {
          auth: {
            sendSignInLinkToEmail: mockSendSignInLinkToEmail,
          },
        },
      },
    })
    const emailInput = wrapper.findComponent(UiMembershipEmailInput)
    const mockEmail = 'example@example.com'
    await emailInput.vm.$emit('input', mockEmail)
    await emailInput.vm.$emit('inputValidStateChange', true)
    const submitButton = wrapper.find('.login-button')
    await submitButton.trigger('click')
    await flushPromises()
    expect(wrapper.find('.login-form-wrapper').exists()).toBe(false)
    expect(wrapper.find('.login-error-wrapper').exists()).toBe(true)
    const errorWrapper = wrapper.findComponent(UiMembershipEmailError)
    await errorWrapper.vm.$emit('backToForm')
    expect(wrapper.find('.login-form-wrapper').exists()).toBe(true)
    expect(wrapper.find('.login-error-wrapper').exists()).toBe(false)
  })
})
