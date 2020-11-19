import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import createWrapperHelper from '@/test/helpers/createWrapperHelper'
import ContainerMembershipMemberIcon from '~/components/ContainerMembershipMemberIcon.vue'
import {
  state as stateMembership,
  getters as gettersMembership,
} from '~/store/membership'

const localVue = createLocalVue()
localVue.use(Vuex)

const createWrapper = createWrapperHelper({
  stubs: ['NuxtLink'],
})

describe('data bindings with vuex store', function () {
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

  test('should show ".not-logged-in-link" if current visitor is not a member', function () {
    const wrapper = createWrapper(ContainerMembershipMemberIcon, {
      localVue,
      store: new Vuex.Store(storeOptions),
    })
    expect(wrapper.find('.not-logged-in-link').exists()).toBe(true)
    expect(wrapper.find('.logged-in-icon').exists()).toBe(false)
  })

  test('should show ".logged-in-icon" if current visitor is a member', function () {
    storeOptions.modules.membership.state.user.email = 'example@example.com'
    const wrapper = createWrapper(ContainerMembershipMemberIcon, {
      localVue,
      store: new Vuex.Store(storeOptions),
    })
    expect(wrapper.find('.not-logged-in-link').exists()).toBe(false)
    expect(wrapper.find('.logged-in-icon').exists()).toBe(true)
  })
})
