import { shallowMount } from '@vue/test-utils'
import ContainerMembershipProfileSuccess from '~/components/ContainerMembershipProfileSuccess.vue'

test('should emit backToForm event after we click the back to form button', async function () {
  const wrapper = shallowMount(ContainerMembershipProfileSuccess)
  await wrapper.get('.back-to-form-button').trigger('click')
  expect(wrapper.emitted().backToForm[0]).toBeTruthy()
})

test('should emit backToForm event after 3 seconds of component mounted', function () {
  jest.useFakeTimers()
  const wrapper = shallowMount(ContainerMembershipProfileSuccess)
  jest.runTimersToTime(3000)
  expect(wrapper.emitted().backToForm[0]).toBeTruthy()
})
