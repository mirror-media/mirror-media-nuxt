import ContainerHeader from '../ContainerHeader.vue'
import UISearchBarWrapper from '../UISearchBarWrapper.vue'
import UIOthersList from '../UIOthersList.vue'
import UIHeaderNavSection from '../UIHeaderNavSection.vue'
import UIHeaderNavTopic from '../UIHeaderNavTopic.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  computed: {
    sections: () => [],
    partners: () => [],
    topics: () => [],
  },
})

describe('options computed', () => {
  test('get the proper data', () => {
    const wrapper = createWrapper(ContainerHeader, {
      computed: {
        sections: () => [{ title: '文化' }, { name: 'videohub' }],
      },
    })

    expect(wrapper.vm.options).toEqual([
      { title: '全部類別' },
      { title: '文化' },
    ])
  })
})

describe('handleSendGA method', () => {
  test('call $ga method when UISearchBarWrapper.vue emits sendGA', () => {
    const $ga = {
      event: jest.fn(),
    }
    const wrapper = createWrapper(ContainerHeader, {
      mocks: {
        $ga,
      },
    })

    const gaArgs = {
      eventCategory: 'header',
      eventAction: 'click',
      eventLabel: 'search',
    }
    wrapper.find(UISearchBarWrapper).vm.$emit('sendGA', gaArgs)
    expect($ga.event).toHaveBeenCalledWith(gaArgs)
  })

  test('call $ga method when UIOthersList.vue emits sendGA', () => {
    const $ga = {
      event: jest.fn(),
    }
    const wrapper = createWrapper(ContainerHeader, {
      mocks: {
        $ga,
      },
    })

    const gaArgs = {
      eventCategory: 'header',
      eventAction: 'click',
      eventLabel: 'more subscribe',
    }
    wrapper.find(UIOthersList).vm.$emit('sendGA', gaArgs)
    expect($ga.event).toHaveBeenCalledWith(gaArgs)
  })

  test('call $ga method when UIHeaderNavSection.vue emits sendGA', () => {
    const $ga = {
      event: jest.fn(),
    }
    const wrapper = createWrapper(ContainerHeader, {
      mocks: {
        $ga,
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

  test('call $ga method when UIHeaderNavTopic.vue emits sendGA', () => {
    const $ga = {
      event: jest.fn(),
    }
    const wrapper = createWrapper(ContainerHeader, {
      mocks: {
        $ga,
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
})
