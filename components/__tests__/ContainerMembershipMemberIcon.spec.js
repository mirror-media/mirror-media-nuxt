import { createLocalVue, RouterLinkStub } from '@vue/test-utils'
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
  stubs: {
    NuxtLink: RouterLinkStub,
  },
})

describe('default data bindings with vuex store', function () {
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

  test('should show ".not-logged-in-link" if current visitor is not a member, and the link is nuxt-link to login page', function () {
    const wrapper = createWrapper(ContainerMembershipMemberIcon, {
      localVue,
      store: new Vuex.Store(storeOptions),
    })
    expect(wrapper.find('.not-logged-in-link').exists()).toBe(true)
    expect(wrapper.getComponent(RouterLinkStub).props().to).toBe('/login')
    expect(wrapper.find('.logged-in-wrapper').exists()).toBe(false)
  })
})

describe('data bindings with vuex store, and user email exist', function () {
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
    storeOptions.modules.membership.state.userEmail = 'example@example.com'
  })

  test('should show ".logged-in-icon" if current visitor is a member', function () {
    const wrapper = createWrapper(ContainerMembershipMemberIcon, {
      localVue,
      store: new Vuex.Store(storeOptions),
    })
    expect(wrapper.find('.not-logged-in-link').exists()).toBe(false)
    expect(wrapper.find('.logged-in-wrapper').exists()).toBe(true)
  })

  test('should show a nuxt-link to profile page if current visitor is a member', function () {
    const wrapper = createWrapper(ContainerMembershipMemberIcon, {
      localVue,
      store: new Vuex.Store(storeOptions),
    })
    expect(wrapper.getComponent(RouterLinkStub).props().to).toBe('/profile')
  })

  test('should call the $fire.auth.signOut after we click the sign out button, if current visitor is a member', async function () {
    const mockFire = {
      auth: {
        signOut: jest.fn(() => Promise.resolve()),
      },
    }
    const wrapper = createWrapper(ContainerMembershipMemberIcon, {
      localVue,
      store: new Vuex.Store(storeOptions),
      mocks: {
        $fire: mockFire,
      },
    })
    const signOutButton = wrapper.get('.sign-out-button')
    await signOutButton.trigger('click')
    expect(mockFire.auth.signOut).toHaveBeenCalled()
  })

  test('should hide the dropdown menu in the logged in wrapper after mounted', function () {
    const wrapper = createWrapper(ContainerMembershipMemberIcon, {
      localVue,
      store: new Vuex.Store(storeOptions),
    })
    expect(wrapper.get('.dropdown-menu').element.style.display).toBe('none')
  })

  test('should show the dropdown menu in the logged in wrapper after logged in icon been clicked, and hide it when we click again', async function () {
    const wrapper = createWrapper(ContainerMembershipMemberIcon, {
      localVue,
      store: new Vuex.Store(storeOptions),
    })
    const memberIcon = wrapper.get('.logged-in-icon')
    await memberIcon.trigger('click')
    expect(wrapper.get('.dropdown-menu').element.style.display).not.toBe('none')
    await memberIcon.trigger('click')
    expect(wrapper.get('.dropdown-menu').element.style.display).toBe('none')
  })
})
