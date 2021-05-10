import { shallowMount } from '@vue/test-utils'
import UiMembershipButtonPrimary from '../UiMembershipButtonPrimary.vue'

test('should render slot content', function () {
  const mockText = 'mockText'
  const wrapper = shallowMount(UiMembershipButtonPrimary, {
    slots: {
      default: `<p>${mockText}</p>`,
    },
  })
  expect(wrapper.text()).toContain(mockText)
})
