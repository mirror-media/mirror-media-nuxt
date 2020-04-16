import { shallowMount } from '@vue/test-utils'
import BaseFooter from '../BaseFooter.vue'

describe('text link of subscribe', () => {
  test('should render proper href and textContent', () => {
    const wrapper = shallowMount(BaseFooter)
    const link = wrapper.find('.footer-subscribe')
    expect(link.text()).toBe(wrapper.vm.links.subscribe.textContent)
    expect(link.attributes().href).toBe(wrapper.vm.links.subscribe.href)
  })
  test('should call $ga method with properties ', () => {
    const $ga = {
      event: jest.fn()
    }
    const wrapper = shallowMount(BaseFooter, {
      mocks: {
        $ga
      }
    })
    const link = wrapper.find('.footer-subscribe')
    link.trigger('click')
    expect($ga.event).toHaveBeenCalledWith({
      eventCategory: wrapper.vm.links.subscribe.ga.eventCategory,
      eventAction: wrapper.vm.links.subscribe.ga.eventAction,
      eventLabel: wrapper.vm.links.subscribe.ga.eventLabel
    })
  })
})

describe('text link of ad', () => {
  test('should render proper href and textContent', () => {
    const wrapper = shallowMount(BaseFooter)
    const link = wrapper.find('.footer-ad')
    expect(link.text()).toBe(wrapper.vm.links.ad.textContent)
    expect(link.attributes().href).toBe(wrapper.vm.links.ad.href)
  })
  test('should call $ga method with properties ', () => {
    const $ga = {
      event: jest.fn()
    }
    const wrapper = shallowMount(BaseFooter, {
      mocks: {
        $ga
      }
    })
    const link = wrapper.find('.footer-ad')
    link.trigger('click')
    expect($ga.event).toHaveBeenCalledWith({
      eventCategory: wrapper.vm.links.ad.ga.eventCategory,
      eventAction: wrapper.vm.links.ad.ga.eventAction,
      eventLabel: wrapper.vm.links.ad.ga.eventLabel
    })
  })
})
