import { shallowMount } from '@vue/test-utils'
import UIMembershipEmailInput from '../UIMembershipEmailInput.vue'

describe('data binding between v-model.trim and vuelidate', function () {
  test('should trim white spaces', async function () {
    expect.assertions(1)
    const wrapper = shallowMount(UIMembershipEmailInput)
    const input = wrapper.find('input')
    const emailWithWhiteSpace = ' example@example.com '
    const emailWithNoWhiteSpace = 'example@example.com'
    await input.setValue(emailWithWhiteSpace)
    expect(wrapper.vm.$v.email.$model).toBe(emailWithNoWhiteSpace)
  })
})

describe('features affect by input state', function () {
  test('should display invalid hint, invalid icon and invalid modifier when input is invalid', async function () {
    expect.assertions(3)
    const wrapper = shallowMount(UIMembershipEmailInput)
    const input = wrapper.find('input')
    const emailInvalid = 'emailInvalid'
    await input.setValue(emailInvalid)
    const invalidHint = wrapper.find('.invalid-hint')
    const invalidIcon = wrapper.find('.invalid-icon')
    const inputWrapper = wrapper.find('.input-wrapper')
    expect(invalidHint.element.style.display).not.toBe('none')
    expect(invalidIcon.element.style.display).not.toBe('none')
    expect(inputWrapper.classes()).toContain('input-wrapper--invalid')
  })
  test('should not display invalid hint, invalid icon and invalid modifier when input is valid', async function () {
    expect.assertions(3)
    const wrapper = shallowMount(UIMembershipEmailInput)
    const input = wrapper.find('input')
    const emailValid = 'example@example.com'
    await input.setValue(emailValid)
    const invalidHint = wrapper.find('.invalid-hint')
    const invalidIcon = wrapper.find('.invalid-icon')
    const inputWrapper = wrapper.find('.input-wrapper')
    expect(invalidHint.element.style.display).toBe('none')
    expect(invalidIcon.element.style.display).toBe('none')
    expect(inputWrapper.classes()).not.toContain('input-wrapper--invalid')
  })
})

describe('component behaviours', function () {
  test('should emit "change" event with value when input was change', async function () {
    expect.assertions(1)
    const wrapper = shallowMount(UIMembershipEmailInput)
    const input = wrapper.find('input')
    const emailValid = 'example@example.com'
    await input.setValue(emailValid)
    expect(wrapper.emitted().change[0]).toEqual([emailValid])
  })
})
