import flushPromises from 'flush-promises'
import createWrapperHelper from '@/test/helpers/createWrapperHelper'
import page from '../login.vue'
import ContainerMembershipLoginWithEmail from '~/components/ContainerMembershipLoginWithEmail.vue'
import UiMembershipEmailSuccess from '~/components/UiMembershipEmailSuccess.vue'

const createWrapper = createWrapperHelper({
  mocks: {
    $fire: {
      auth: {
        getRedirectResult: jest.fn(() => Promise.resolve({ user: null })),
      },
    },
  },
})

describe('email auth', function () {
  test('should hide email form and show the email sent successfully hint with proper email in /login page', async function () {
    const wrapper = createWrapper(page)
    const emailForm = wrapper.findComponent(ContainerMembershipLoginWithEmail)
    const mockEmail = 'example@example.com'
    await emailForm.vm.$emit('success', mockEmail)
    expect(emailForm.exists()).toBe(false)
    expect(wrapper.find('.success-wrapper').exists()).toBe(true)
    expect(
      wrapper.findComponent(UiMembershipEmailSuccess).props().emailInput
    ).toBe(mockEmail)
    expect(wrapper.find('.error-wrapper').exists()).toBe(false)
  })

  test('should hide email form and show the error hint if encounter some error', async function () {
    const wrapper = createWrapper(page)
    const emailForm = wrapper.findComponent(ContainerMembershipLoginWithEmail)
    await emailForm.vm.$emit('error')
    expect(emailForm.exists()).toBe(false)
    expect(wrapper.find('.success-wrapper').exists()).toBe(false)
    expect(wrapper.find('.error-wrapper').exists()).toBe(true)
  })
})

describe('validations about visitor have been redirect back to login page after Google/Facebook auth', function () {
  test('should redirect to home page before login paged mount, and current visitor come to login page is because they have been redirect by Google/Facebook auth', async function () {
    delete window.location
    window.location = {
      replace: jest.fn(),
    }
    createWrapper(page, {
      mocks: {
        $fire: {
          auth: {
            getRedirectResult: jest.fn(() => Promise.resolve({ user: {} })),
          },
        },
      },
    })
    await flushPromises()
    expect(window.location.replace).toHaveBeenCalledWith('/')
  })

  test('should not redirect to home page before login paged mount, because the reason why the current visitor come to login page is not been redirect by Google/Facebook auth', async function () {
    const mockRouter = {
      replace: jest.fn(),
    }
    createWrapper(page, {
      mocks: {
        $router: mockRouter,
        $fire: {
          auth: {
            getRedirectResult: jest.fn(() => Promise.resolve({ user: null })),
          },
        },
      },
    })
    await flushPromises()
    expect(mockRouter.replace).not.toHaveBeenCalledWith('/')
  })

  test('should hide email form and show the error hint in /login page if $fire.auth.getRedirectResult encounter some error', async function () {
    const wrapper = createWrapper(page, {
      mocks: {
        $fire: {
          auth: {
            getRedirectResult: jest.fn(() =>
              Promise.reject(new Error('mock error'))
            ),
          },
        },
      },
    })
    await flushPromises()
    const emailForm = wrapper.findComponent(ContainerMembershipLoginWithEmail)
    expect(emailForm.exists()).toBe(false)
    expect(wrapper.find('.success-wrapper').exists()).toBe(false)
    expect(wrapper.find('.error-wrapper').exists()).toBe(true)
  })
})
