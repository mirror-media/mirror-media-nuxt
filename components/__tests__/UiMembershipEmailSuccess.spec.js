import { shallowMount } from '@vue/test-utils'
import UiMembershipEmailSuccess from '~/components/UiMembershipEmailSuccess.vue'

test('should render the email text', function () {
  const mockEmailInput = 'example@example.com'
  const wrapper = shallowMount(UiMembershipEmailSuccess, {
    propsData: {
      emailInput: mockEmailInput,
    },
  })
  expect(wrapper.text()).toContain(mockEmailInput)
})
