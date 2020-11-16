import { shallowMount } from '@vue/test-utils'
import page from '../login.vue'
import ContainerMembershipLoginWithEmail from '~/components/ContainerMembershipLoginWithEmail.vue'
import UiMembershipEmailSuccess from '~/components/UiMembershipEmailSuccess.vue'

test('should hide email form and show the email sent successfully hint with proper email in /login page', async function () {
  const wrapper = shallowMount(page)
  const emailForm = wrapper.findComponent(ContainerMembershipLoginWithEmail)
  const mockEmail = 'example@example.com'
  await emailForm.vm.$emit('success', mockEmail)
  expect(emailForm.exists()).toBe(false)
  expect(wrapper.find('.success-wrapper').exists()).toBe(true)
  expect(
    wrapper.findComponent(UiMembershipEmailSuccess).props().emailInput
  ).toBe(mockEmail)
  expect(wrapper.find('.error-wrapper').exists()).toBe(false)
})

test('should hide email form and show the email sent successfully hint with proper email in /login page', async function () {
  const wrapper = shallowMount(page)
  const emailForm = wrapper.findComponent(ContainerMembershipLoginWithEmail)
  await emailForm.vm.$emit('error')
  expect(emailForm.exists()).toBe(false)
  expect(wrapper.find('.success-wrapper').exists()).toBe(false)
  expect(wrapper.find('.error-wrapper').exists()).toBe(true)
})
