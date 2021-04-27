import { shallowMount } from '@vue/test-utils'
import UiRecoverPasswordInputEmail from '../UiRecoverPasswordInputEmail.vue'
import UiMembershipInput from '../UiMembershipInput.vue'

describe('data binding between v-model.trim and vuelidate', function () {
  test('should trim white spaces', function () {
    const wrapper = shallowMount(UiRecoverPasswordInputEmail)
    const input = wrapper.getComponent(UiMembershipInput)
    const emailWithWhiteSpace = ' example@example.com '
    const emailWithNoWhiteSpace = 'example@example.com'
    input.vm.$emit('input', emailWithWhiteSpace)
    expect(wrapper.vm.$v.email.$model).toBe(emailWithNoWhiteSpace)
  })
})

describe('features affect by input state', function () {
  test('should display black border on input and invalid hint when input is not valid email', async function () {
    expect.assertions(2)
    const wrapper = shallowMount(UiRecoverPasswordInputEmail)
    await wrapper.setProps({
      shouldShowInvalidHint: true,
    })
    const input = wrapper.getComponent(UiMembershipInput)
    const emailInvalid = 'emailInvalid'
    input.vm.$emit('input', emailInvalid)
    expect(input.classes()).toContain('border-black')
    expect(wrapper.get('.invalid-hint').element.style.display).not.toBe('none')
  })
  test('should not display black border on input and invalid hint when input is valid email', async function () {
    expect.assertions(2)
    const wrapper = shallowMount(UiRecoverPasswordInputEmail)
    await wrapper.setProps({
      shouldShowInvalidHint: true,
    })
    const input = wrapper.getComponent(UiMembershipInput)
    const emailValid = 'example@example.com'
    input.vm.$emit('input', emailValid)
    await wrapper.vm.$nextTick()
    expect(input.classes()).not.toContain('border-black')
    expect(wrapper.get('.invalid-hint').element.style.display).toBe('none')
  })
  test('should not display black border on input and invalid hint when input is not valid email, even if input is invalid', async function () {
    expect.assertions(2)
    const wrapper = shallowMount(UiRecoverPasswordInputEmail)
    await wrapper.setProps({
      shouldShowInvalidHint: false,
    })
    const input = wrapper.getComponent(UiMembershipInput)
    const emailInvalid = 'mailInvalid'
    input.vm.$emit('input', emailInvalid)
    await wrapper.vm.$nextTick()
    expect(input.classes()).not.toContain('border-black')
    expect(wrapper.get('.invalid-hint').element.style.display).toBe('none')
  })
})

describe('component behaviours', function () {
  test('should emit "input" event with value when input was change', function () {
    const wrapper = shallowMount(UiRecoverPasswordInputEmail)
    const input = wrapper.getComponent(UiMembershipInput)
    const emailValid = 'example@example.com'
    input.vm.$emit('input', emailValid)
    expect(wrapper.emitted().input[0]).toEqual([emailValid])
  })
  test('should emit "inputValidStateChange" event with value when input validation state changed', async function () {
    expect.assertions(1)
    const wrapper = shallowMount(UiRecoverPasswordInputEmail)
    const input = wrapper.getComponent(UiMembershipInput)
    const emailValid = 'example@example.com'
    input.vm.$emit('input', emailValid)
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().inputValidStateChange[0]).toEqual([true])
  })
})
