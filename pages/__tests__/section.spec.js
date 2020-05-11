import { shallowMount } from '@vue/test-utils'
import page from '../section/_name.vue'

describe('createInfoDescriptions method', () => {
  test('should return all the string primitives in content array', () => {
    const wrapper = shallowMount(page)
    const data = [
      {
        content: ['foo', 'bar'],
      },
      {
        content: ['123'],
      },
    ]
    expect(wrapper.vm.createInfoDescriptions(data)).toBe('foobar123')
  })

  test('should skip all the non-string item in content array', () => {
    const wrapper = shallowMount(page)
    const data = [
      {
        content: ['foo', 'bar', {}, [], true, null, undefined, 123],
      },
      {
        content: ['123'],
      },
    ]
    expect(wrapper.vm.createInfoDescriptions(data)).toBe('foobar123')
  })
})
