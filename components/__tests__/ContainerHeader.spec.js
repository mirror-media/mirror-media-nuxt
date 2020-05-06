import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import ContainerHeader from '../ContainerHeader.vue'
import UIHeaderNavSection from '../UIHeaderNavSection.vue'
import UIHeaderNavTopic from '../UIHeaderNavTopic.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Vuex state computed', () => {
  test('get the proper data', () => {
    const store = new Vuex.Store({
      state: {
        sections: { items: [{ name: 'news' }] },
        topics: { items: [{ name: '網紅星勢力' }] },
        partners: { items: [{ name: 'healthnews' }] },
      },
    })
    const wrapper = shallowMount(ContainerHeader, { store, localVue })

    expect(wrapper.vm.sections).toEqual([{ name: 'news' }])
    expect(wrapper.vm.topics).toEqual([{ name: '網紅星勢力' }])
    expect(wrapper.vm.partners).toEqual([{ name: 'healthnews' }])
  })

  test('get an empty array when the data is undefined', () => {
    const store = new Vuex.Store({
      state: {
        sections: {},
        topics: {},
        partners: {},
      },
    })
    const wrapper = shallowMount(ContainerHeader, { store, localVue })

    expect(wrapper.vm.sections).toEqual([])
    expect(wrapper.vm.topics).toEqual([])
    expect(wrapper.vm.partners).toEqual([])
  })
})

describe('handleSendGA method', () => {
  const store = new Vuex.Store({
    state: {
      sections: {},
      topics: {},
      partners: {},
    },
  })

  test('throw error when the argument is invalid', () => {
    const wrapper = shallowMount(ContainerHeader, { store, localVue })

    expect(() => {
      wrapper.vm.handleSendGA()
    }).toThrow(wrapper.vm.gaError)

    const invalidArgs = {
      eventCategoryInvalid: 'header',
      eventAction: 'click',
      eventLabel: 'section news',
    }
    expect(() => {
      wrapper.vm.handleSendGA(invalidArgs)
    }).toThrow(wrapper.vm.gaError)
  })

  test('call $ga method when UIHeaderNavTopic.vue emits sendGA', () => {
    const $ga = {
      event: jest.fn(),
    }
    const wrapper = shallowMount(ContainerHeader, {
      mocks: {
        $ga,
      },
      store,
      localVue,
    })
    const gaArgs = {
      eventCategory: 'header',
      eventAction: 'click',
      eventLabel: 'topic 人造地獄',
    }
    wrapper.find(UIHeaderNavTopic).vm.$emit('sendGA', gaArgs)
    expect($ga.event).toHaveBeenCalledWith(gaArgs)
  })

  test('call $ga method when UIHeaderNavSection.vue emits sendGA', () => {
    const $ga = {
      event: jest.fn(),
    }
    const wrapper = shallowMount(ContainerHeader, {
      mocks: {
        $ga,
      },
      store,
      localVue,
    })
    const gaArgs = {
      eventCategory: 'header',
      eventAction: 'click',
      eventLabel: 'section news',
    }
    wrapper.find(UIHeaderNavSection).vm.$emit('sendGA', gaArgs)
    expect($ga.event).toHaveBeenCalledWith(gaArgs)
  })
})

describe('markup', () => {
  test('has a header tag', () => {
    const store = new Vuex.Store({
      state: {
        sections: {},
        topics: {},
        partners: {},
      },
    })
    const wrapper = shallowMount(ContainerHeader, { store, localVue })

    expect(wrapper.contains('header')).toBe(true)
  })
})
