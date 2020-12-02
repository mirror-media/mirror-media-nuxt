import { shallowMount } from '@vue/test-utils'
import page from '../profile.vue'
import ContainerMembershipProfileForm from '~/components/ContainerMembershipProfileForm.vue'
import ContainerMembershipProfileSuccess from '~/components/ContainerMembershipProfileSuccess.vue'

test('should show the success layout after form component emit a success event', async function () {
  const wrapper = shallowMount(page)
  const form = wrapper.findComponent(ContainerMembershipProfileForm)
  expect(form.exists()).toBe(true)
  expect(
    wrapper.findComponent(ContainerMembershipProfileSuccess).exists()
  ).toBe(false)
  await form.vm.$emit('success')
  expect(form.exists()).toBe(false)
  expect(
    wrapper.findComponent(ContainerMembershipProfileSuccess).exists()
  ).toBe(true)
})
