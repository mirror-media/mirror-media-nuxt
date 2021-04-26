import { shallowMount } from '@vue/test-utils'
import UiRecoverPasswordButton from '../UiRecoverPasswordButton.vue'

test('should render slot content', function () {
  const mockText = 'mockText'
  const wrapper = shallowMount(UiRecoverPasswordButton, {
    slots: {
      default: `<p>${mockText}</p>`,
    },
  })
  expect(wrapper.text()).toContain(mockText)
})
