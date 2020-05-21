import ContainerHeader from '../ContainerHeader.vue'
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

describe('handleSendGA method', () => {
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
})

describe('markup', () => {
  test('render correctly', () => {
    const wrapper = createWrapper(ContainerHeader)

    expect(wrapper.element).toMatchSnapshot()
  })
})
