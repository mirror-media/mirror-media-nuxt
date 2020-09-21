import UIShareLine from '../UIShareLine.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper()
const lineSharedUrl = 'https://social-plugins.line.me/lineit/share?url='

describe('href', () => {
  test('render the proper href', async () => {
    const url = 'https://www.mirrormedia.mg/'
    const windowSpy = jest.spyOn(window, 'location', 'get')

    windowSpy.mockImplementation(() => ({
      href: url,
    }))

    const wrapper = createWrapper(UIShareLine)
    await wrapper.vm.$nextTick()
    const link = wrapper.get('a')
    expect(link.attributes().href).toBe(
      `${lineSharedUrl}${encodeURIComponent(url)}`
    )
  })

  test('render the proper href from the prop "url"', async () => {
    const mockUrl1 = 'https://www.mirrormedia.mg/'
    const mockUrl2 = 'https://www.mirrormedia.mg/story/20200921ent009/'
    const wrapper = createWrapper(UIShareLine, {
      propsData: {
        url: mockUrl1,
      },
    })

    const link = wrapper.get('a')

    expect(link.attributes().href).toBe(
      `${lineSharedUrl}${encodeURIComponent(mockUrl1)}`
    )

    await wrapper.setProps({ url: mockUrl2 })

    expect(link.attributes().href).toBe(
      `${lineSharedUrl}${encodeURIComponent(mockUrl2)}`
    )
  })
})

describe('facebook logo', () => {
  test('use proper png image', () => {
    const wrapper = createWrapper(UIShareLine)
    const image = wrapper.get(`picture > img`)

    const logoUrlPng = '~/assets/line_logo_official_90.png'
    expect(image.attributes().src).toBe(logoUrlPng)
  })
  test('use proper webp image', () => {
    const wrapper = createWrapper(UIShareLine)
    const image = wrapper.get(`picture > source[type="image/webp"]`)

    const logoUrlWebp = '~/assets/line_logo_official_90.webp'
    expect(image.attributes().srcset).toBe(logoUrlWebp)
  })
})

describe('click event', () => {
  test('should emit click event', () => {
    const wrapper = createWrapper(UIShareLine)
    const link = wrapper.get('a')
    link.trigger('click')
    expect(link.emitted().click).toBeTruthy()
  })
})
