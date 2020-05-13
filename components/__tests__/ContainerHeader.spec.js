import { shallowMount } from '@vue/test-utils'
import ContainerHeader from '../ContainerHeader.vue'
import UIHeaderNavSection from '../UIHeaderNavSection.vue'
import UIHeaderNavTopic from '../UIHeaderNavTopic.vue'

describe('computed from Vuex state', () => {
  test('get the proper data', () => {
    const wrapper = shallowMount(ContainerHeader, {
      mocks: {
        $store: {
          state: {
            sections: { data: { items: [{ name: 'news' }] } },
            topics: { data: { items: [{ name: '網紅星勢力' }] } },
            partners: { data: { items: [{ name: 'healthnews' }] } },
          },
        },
      },
    })

    expect(wrapper.vm.sections).toEqual([{ name: 'news' }])
    expect(wrapper.vm.topics).toEqual([{ name: '網紅星勢力' }])
    expect(wrapper.vm.partners).toEqual([{ name: 'healthnews' }])
  })

  test('get an empty array when the data is undefined', () => {
    const wrapper = shallowMount(ContainerHeader, {
      mocks: {
        $store: {
          state: {
            sections: { data: {} },
            topics: { data: {} },
            partners: { data: {} },
          },
        },
      },
    })

    expect(wrapper.vm.sections).toEqual([])
    expect(wrapper.vm.topics).toEqual([])
    expect(wrapper.vm.partners).toEqual([])
  })
})

describe('handleSendGA method', () => {
  const $store = {
    state: {
      sections: { data: {} },
      topics: { data: {} },
      partners: { data: {} },
    },
  }

  test('call $ga method when UIHeaderNavTopic.vue emits sendGA', () => {
    const $ga = {
      event: jest.fn(),
    }
    const wrapper = shallowMount(ContainerHeader, {
      mocks: {
        $ga,
        $store,
      },
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
        $store,
      },
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
  test('render correctly', () => {
    const wrapper = shallowMount(ContainerHeader, {
      mocks: {
        $store: {
          state: {
            sections: { data: {} },
            topics: { data: {} },
            partners: { data: {} },
          },
        },
      },
    })

    expect(wrapper.element).toMatchSnapshot()
  })
})
