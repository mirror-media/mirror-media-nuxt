import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import page from '../cancelMembership.vue'
import {
  getters as gettersMembership,
  state as stateMembership,
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
    storeOptions.modules.membership.state.user.email = mockEmail
  })

  test('should show the email of the current member in profile page', function () {
    const wrapper = shallowMount(page, {
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
          getters: gettersMembership,
        },
      },
    }
  })

  test('should call the back function of the router after we click the back button', async function () {
    const mockRouter = {
      back: jest.fn(),
    }
    const wrapper = shallowMount(page, {
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
})
