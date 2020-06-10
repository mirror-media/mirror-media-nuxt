import UIShareFacebook from '../UIShareFacebook.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper()

describe('href', () => {
  test('render the proper href', async () => {
    const url = 'https://www.mirrormedia.mg/'
    const windowSpy = jest.spyOn(window, 'location', 'get')

    windowSpy.mockImplementation(() => ({
      href: url,
    }))

    const wrapper = createWrapper(UIShareFacebook)
    await wrapper.vm.$nextTick()
    const link = wrapper.get('a')
    expect(link.attributes().href).toBe(
      `https://www.facebook.com/share.php?u=${url}`
    )
  })

  test('render the proper href from props', () => {
    const url = 'https://www.mirrormedia.mg/'
    const wrapper = createWrapper(UIShareFacebook, {
      propsData: {
        url,
      },
    })
    const link = wrapper.get('a')
    expect(link.attributes().href).toBe(
      `https://www.facebook.com/share.php?u=${url}`
    )
  })
})

describe('facebook logo', () => {
  test('use proper png image', () => {
    const wrapper = createWrapper(UIShareFacebook)
    const image = wrapper.get(`picture > img`)

    const logoUrlPng = '~/assets/facebook_logo_official_72.png'
    expect(image.attributes().src).toBe(logoUrlPng)
  })
  test('use proper webp image', () => {
    const wrapper = createWrapper(UIShareFacebook)
    const image = wrapper.get(`picture > source[type="image/webp"]`)

    const logoUrlWebp = '~/assets/facebook_logo_official_72.webp'
    expect(image.attributes().srcset).toBe(logoUrlWebp)
  })
})

describe('click event', () => {
  test('should emit click event', () => {
    const wrapper = createWrapper(UIShareFacebook)
    const link = wrapper.get('a')
    link.trigger('click')
    expect(link.emitted().click).toBeTruthy()
  })
})
