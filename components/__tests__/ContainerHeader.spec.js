import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import ContainerHeader from '../ContainerHeader.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('computed Vuex state', () => {
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

  test('get a [] when the data is undefined', () => {
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

describe('handleSendGA', () => {
  const store = new Vuex.Store({
    state: {
      sections: {},
      topics: {},
      partners: {},
    },
  })
  const wrapper = shallowMount(ContainerHeader, { store, localVue })

  test('should throw error when argument is invalid', () => {
    expect(() => {
      wrapper.vm.handleSendGA()
    }).toThrow(wrapper.vm.gaError)

    const invalidArgs = {
      eventCategoryInvalid: 'header',
      eventAction: 'click',
      eventLabel: 'section readr',
    }
    expect(() => {
      wrapper.vm.handleSendGA(invalidArgs)
    }).toThrow(wrapper.vm.gaError)
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
