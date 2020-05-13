import { shallowMount } from '@vue/test-utils'
import page from '../section/_name.vue'

describe('stripHtmlTag method', () => {
  test('should strip html tags successfully', () => {
    const wrapper = shallowMount(page)
    const html = '<div><script></script><p>foo</p><p>bar</p><p>123</p></div>'
    expect(wrapper.vm.stripHtmlTag(html)).toBe('foobar123')
  })
  test('should return the same result if there is not html tags', () => {
    const wrapper = shallowMount(page)
    const html = 'foobar123'
    expect(wrapper.vm.stripHtmlTag(html)).toBe('foobar123')
  })
})
