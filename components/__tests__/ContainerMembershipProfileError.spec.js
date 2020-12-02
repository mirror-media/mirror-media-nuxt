import { shallowMount } from '@vue/test-utils'
import ContainerMembershipProfileError from '~/components/ContainerMembershipProfileError.vue'

test('should emit backToForm event after we click the back to form button', async function () {
  const wrapper = shallowMount(ContainerMembershipProfileError)
  await wrapper.get('.back-to-form-button').trigger('click')
  expect(wrapper.emitted().backToForm[0]).toBeTruthy()
})
