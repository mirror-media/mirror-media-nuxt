import { createLocalVue, RouterLinkStub } from '@vue/test-utils'
import Vuex from 'vuex'
import createWrapperHelper from '@/test/helpers/createWrapperHelper'
import ContainerMembershipProfileForm from '../ContainerMembershipProfileForm.vue'
import {
  getters as gettersMembership,
  state as stateMembership,
} from '~/store/membership'

const localVue = createLocalVue()
localVue.use(Vuex)

const createWrapper = createWrapperHelper({
  mocks: {
    $fire: {
      auth: {},
    },
  },
  stubs: {
    NuxtLink: RouterLinkStub,
  },
})

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
    const wrapper = createWrapper(ContainerMembershipProfileForm, {
      localVue,
      store: new Vuex.Store(storeOptions),
    })
    const currentMemberEmail = wrapper.get('.current-member-email')
    expect(currentMemberEmail.text()).toBe(mockEmail)
  })
})

// TODO: finish tests about many behaviours after submit
/*
 * describe('submit button', function () {
 *   let storeOptions
 *   beforeEach(() => {
 *     storeOptions = {
 *       modules: {
 *         membership: {
 *           namespaced: true,
 *           state: stateMembership(),
 *           getters: gettersMembership,
 *         },
 *       },
 *     }
 *   })
 *
 *   test('should emit success event after we click the submit button', async function () {
 *     const wrapper = createWrapper(ContainerMembershipProfileForm, {
 *       localVue,
 *       store: new Vuex.Store(storeOptions),
 *     })
 *     await wrapper.get('.submit-button').trigger('click')
 *     expect(wrapper.emitted().success[0]).toBeTruthy()
 *   })
 * })
 */
