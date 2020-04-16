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

describe('text link of activity', () => {
  test('should render proper href and textContent', () => {
    const wrapper = shallowMount(BaseFooter)
    const link = wrapper.find('.footer-activity')
    expect(link.text()).toBe(wrapper.vm.links.activity.textContent)
    expect(link.attributes().href).toBe(wrapper.vm.links.activity.href)
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
    const link = wrapper.find('.footer-activity')
    link.trigger('click')
    expect($ga.event).toHaveBeenCalledWith({
      eventCategory: wrapper.vm.links.activity.ga.eventCategory,
      eventAction: wrapper.vm.links.activity.ga.eventAction,
      eventLabel: wrapper.vm.links.activity.ga.eventLabel
    })
  })
})

describe('text link of download-app', () => {
  test('should render proper href and textContent', () => {
    const wrapper = shallowMount(BaseFooter)
    const link = wrapper.find('.footer-download-app')
    expect(link.text()).toBe(wrapper.vm.links.downloadApp.textContent)
    expect(link.attributes().href).toBe(wrapper.vm.links.downloadApp.href)
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
    const link = wrapper.find('.footer-download-app')
    link.trigger('click')
    expect($ga.event).toHaveBeenCalledWith({
      eventCategory: wrapper.vm.links.downloadApp.ga.eventCategory,
      eventAction: wrapper.vm.links.downloadApp.ga.eventAction,
      eventLabel: wrapper.vm.links.downloadApp.ga.eventLabel
    })
  })
})

describe('text link of auth', () => {
  test('should render proper href and textContent', () => {
    const wrapper = shallowMount(BaseFooter)
    const link = wrapper.find('.footer-auth')
    expect(link.text()).toBe(wrapper.vm.links.auth.textContent)
    expect(link.attributes().href).toBe(wrapper.vm.links.auth.href)
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
    const link = wrapper.find('.footer-auth')
    link.trigger('click')
    expect($ga.event).toHaveBeenCalledWith({
      eventCategory: wrapper.vm.links.auth.ga.eventCategory,
      eventAction: wrapper.vm.links.auth.ga.eventAction,
      eventLabel: wrapper.vm.links.auth.ga.eventLabel
    })
  })
})

describe('icon link of line', () => {
  test('should render proper href', () => {
    const wrapper = shallowMount(BaseFooter)
    const link = wrapper.find('.footer-line')
    expect(link.attributes().href).toBe(wrapper.vm.links.line.href)
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
    const link = wrapper.find('.footer-line')
    link.trigger('click')
    expect($ga.event).toHaveBeenCalledWith({
      eventCategory: wrapper.vm.links.line.ga.eventCategory,
      eventAction: wrapper.vm.links.line.ga.eventAction,
      eventLabel: wrapper.vm.links.line.ga.eventLabel
    })
  })
})

describe('icon link of weibo', () => {
  test('should render proper href', () => {
    const wrapper = shallowMount(BaseFooter)
    const link = wrapper.find('.footer-weibo')
    expect(link.attributes().href).toBe(wrapper.vm.links.weibo.href)
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
    const link = wrapper.find('.footer-weibo')
    link.trigger('click')
    expect($ga.event).toHaveBeenCalledWith({
      eventCategory: wrapper.vm.links.weibo.ga.eventCategory,
      eventAction: wrapper.vm.links.weibo.ga.eventAction,
      eventLabel: wrapper.vm.links.weibo.ga.eventLabel
    })
  })
})

describe('icon link of facebook', () => {
  test('should render proper href', () => {
    const wrapper = shallowMount(BaseFooter)
    const link = wrapper.find('.footer-facebook')
    expect(link.attributes().href).toBe(wrapper.vm.links.facebook.href)
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
    const link = wrapper.find('.footer-facebook')
    link.trigger('click')
    expect($ga.event).toHaveBeenCalledWith({
      eventCategory: wrapper.vm.links.facebook.ga.eventCategory,
      eventAction: wrapper.vm.links.facebook.ga.eventAction,
      eventLabel: wrapper.vm.links.facebook.ga.eventLabel
    })
  })
})

describe('icon link of instagram', () => {
  test('should render proper href', () => {
    const wrapper = shallowMount(BaseFooter)
    const link = wrapper.find('.footer-instagram')
    expect(link.attributes().href).toBe(wrapper.vm.links.instagram.href)
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
    const link = wrapper.find('.footer-instagram')
    link.trigger('click')
    expect($ga.event).toHaveBeenCalledWith({
      eventCategory: wrapper.vm.links.instagram.ga.eventCategory,
      eventAction: wrapper.vm.links.instagram.ga.eventAction,
      eventLabel: wrapper.vm.links.instagram.ga.eventLabel
    })
  })
})
