import { shallowMount } from '@vue/test-utils'
import UiMembershipSpinner from '~/components/UiMembershipSpinner'

test('should render bounce elements with proper background color provide by props', function () {
  const mockColor = '#123456'
  const wrapper = shallowMount(UiMembershipSpinner, {
    propsData: {
      color: mockColor,
    },
  })
  const bounces = wrapper.findAll('.bounce')
  const mockColorRgb = hexToRgb(mockColor)
  const r = mockColorRgb.r
  const g = mockColorRgb.g
  const b = mockColorRgb.b
  bounces.wrappers.forEach((bounce) => {
    expect(bounce.element.style.backgroundColor).toBe(`rgb(${r}, ${g}, ${b})`)
  })
})

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}
