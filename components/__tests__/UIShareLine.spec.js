import UIShareLine from '../UIShareLine.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper()

describe('href', () => {
  test('render the proper href', async () => {
    const url = 'https://www.mirrormedia.mg/'
    Object.defineProperty(window, 'location', {
      value: {
        href: url,
      },
    })

    const wrapper = createWrapper(UIShareLine)
    await wrapper.vm.$nextTick()
    const link = wrapper.get('a')
    expect(link.attributes().href).toBe(
      `https://social-plugins.line.me/lineit/share?url={encodeURIComponent(${url})}`
    )
  })

  test('render the proper href from props', () => {
    const url = 'https://www.mirrormedia.mg/'
    const wrapper = createWrapper(UIShareLine, {
      propsData: {
        url,
      },
    })
    const link = wrapper.get('a')
    expect(link.attributes().href).toBe(
      `https://social-plugins.line.me/lineit/share?url={encodeURIComponent(${url})}`
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
