import { shallowMount } from '@vue/test-utils'
import UiMembershipEmailError from '~/components/UiMembershipEmailError.vue'

test('should emit "backToForm" event when backToFormButton clicked', async function () {
  const wrapper = shallowMount(UiMembershipEmailError)
  const backToFormButton = wrapper.find('.back-to-form-button')
  await backToFormButton.trigger('click')
  expect(wrapper.emitted().backToForm).toBeTruthy()
})
