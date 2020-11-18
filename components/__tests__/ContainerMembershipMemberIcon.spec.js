import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import ContainerMembershipMemberIcon from '~/components/ContainerMembershipMemberIcon.vue'
import {
  state as stateMembership,
  getters as gettersMembership,
} from '~/store/membership'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('data bindings with vuex store', function () {
  let store
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
    store = new Vuex.Store(storeOptions)
  })

  test('should show ".not-logged-in-icon" if current visitor is not a member', function () {
    const wrapper = shallowMount(ContainerMembershipMemberIcon, {
      localVue,
      store,
    })
    expect(wrapper.find('.not-logged-in-icon').exists()).toBe(true)
    expect(wrapper.find('.logged-in-icon').exists()).toBe(false)
  })

  test('should show ".logged-in-icon" if current visitor is a member', function () {
    storeOptions.modules.membership.state.user.email = 'example@example.com'
    store = new Vuex.Store(storeOptions)
    const wrapper = shallowMount(ContainerMembershipMemberIcon, {
      localVue,
      store,
    })
    expect(wrapper.find('.not-logged-in-icon').exists()).toBe(false)
    expect(wrapper.find('.logged-in-icon').exists()).toBe(true)
  })
})
