import { shallowMount } from '@vue/test-utils'
import UiMembershipError from '~/components/UiMembershipError.vue'

test('should emit "backToForm" event when backToFormButton clicked', async function () {
  const wrapper = shallowMount(UiMembershipError)
  const backToFormButton = wrapper.find('.back-to-form-button')
  await backToFormButton.trigger('click')
  expect(wrapper.emitted().backToForm).toBeTruthy()
})
