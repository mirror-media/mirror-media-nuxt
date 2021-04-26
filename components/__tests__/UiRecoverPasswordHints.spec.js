import { shallowMount } from '@vue/test-utils'
import UiRecoverPasswordHints from '~/components/UiRecoverPasswordHints.vue'

describe('state props', function () {
  test('sending', function () {
    const wrapper = shallowMount(UiRecoverPasswordHints, {
      propsData: {
        state: 'sending',
      },
    })
    expect(wrapper.text()).toContain('正在寄出信件...')
  })
  test('emailNotExist', function () {
    const wrapper = shallowMount(UiRecoverPasswordHints, {
      propsData: {
        state: 'emailNotExist',
      },
    })
    expect(wrapper.text()).toContain('這個 Email 尚未註冊，請註冊會員')
  })
  test('error', function () {
    const wrapper = shallowMount(UiRecoverPasswordHints, {
      propsData: {
        state: 'error',
      },
    })
    expect(wrapper.text()).toContain('Email 寄出失敗，請重新再試')
  })
  test('success', function () {
    const wrapper = shallowMount(UiRecoverPasswordHints, {
      propsData: {
        state: 'success',
      },
    })
    expect(wrapper.text()).toContain('Email 已成功寄出')
    expect(wrapper.text()).toContain(
      '沒收到信嗎？請檢查垃圾信件匣，或等候 30 秒重新寄送'
    )
  })
})
