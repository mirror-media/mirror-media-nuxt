import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import ContainerMembershipCancelPleaseConfirm from '../ContainerMembershipCancelPleaseConfirm.vue'
import {
  getters as gettersMembership,
  state as stateMembership,
  mutations as mutationsMembership,
} from '~/store/membership'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('data bindings with vuex store, and user email exist', function () {
  const mockEmail = 'example@example.com'
  let storeOptions
  beforeEach(() => {
    storeOptions = {
      modules: {
        membership: {
          namespaced: true,
          state: stateMembership(),
          getters: gettersMembership,
        },
      },
    }
    storeOptions.modules.membership.state.userEmail = mockEmail
  })

  test('should show the email of the current member in profile page', function () {
    const wrapper = shallowMount(ContainerMembershipCancelPleaseConfirm, {
      localVue,
      store: new Vuex.Store(storeOptions),
    })
    const currentMemberEmail = wrapper.get('.current-member-email')
    expect(currentMemberEmail.text()).toBe(mockEmail)
  })
})

describe('buttons in the page', function () {
  let storeOptions
  beforeEach(() => {
    storeOptions = {
      modules: {
        membership: {
          namespaced: true,
          state: stateMembership(),
          mutations: mutationsMembership,
          getters: gettersMembership,
        },
      },
    }
  })

  test('should call the back function of the router after we click the back button', async function () {
    const mockRouter = {
      back: jest.fn(),
    }
    const wrapper = shallowMount(ContainerMembershipCancelPleaseConfirm, {
      mocks: {
        $router: mockRouter,
      },
      localVue,
      store: new Vuex.Store(storeOptions),
    })
    const routerBackButton = wrapper.get('.router-back-button')
    await routerBackButton.trigger('click')
    expect(mockRouter.back).toHaveBeenCalled()
  })

  test('should emit success event after confirm cancel button clicked', async function () {
    const wrapper = shallowMount(ContainerMembershipCancelPleaseConfirm, {
      mocks: {
        store: new Vuex.Store(storeOptions),
        $apollo: {
          mutate: jest.fn(() => Promise.resolve({ error: null })),
        },
        $fire: {
          auth: {
            signOut: jest.fn(() => Promise.resolve()),
          },
        },
      },
      localVue,
      store: new Vuex.Store(storeOptions),
    })
    await wrapper.get('.confirm-cancel-button').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().success).toBeTruthy()
  })
})
