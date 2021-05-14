import { shallowMount } from '@vue/test-utils'
import UiMagazineFeatured from '../UiMagazineFeatured.vue'

describe('props', function () {
  test('coverImgUrl', function () {
    const imgUrlMock = 'https://img.png'
    const wrapper = shallowMount(UiMagazineFeatured, {
      propsData: {
        coverImgUrl: imgUrlMock,
      },
    })
    expect(wrapper.get('.cover-img').attributes().src).toBe(imgUrlMock)
  })
  test('label', function () {
    const labelMock = '第 123 期'
    const wrapper = shallowMount(UiMagazineFeatured, {
      propsData: {
        label: labelMock,
      },
    })
    expect(wrapper.get('.label').text()).toBe(labelMock)
  })
  test('title', function () {
    const titleMock = 'title'
    const wrapper = shallowMount(UiMagazineFeatured, {
      propsData: {
        title: titleMock,
      },
    })
    expect(wrapper.get('.title').text()).toBe(titleMock)
  })
  test('downloadLink', function () {
    const downloadLinkMock = 'http://download'
    const wrapper = shallowMount(UiMagazineFeatured, {
      propsData: {
        downloadLink: downloadLinkMock,
      },
    })
    const downloadLinks = wrapper.findAll('.download-link')
    expect(downloadLinks.length).not.toBe(0)
    downloadLinks.wrappers.forEach(function assertLinkHref(link) {
      expect(link.attributes().href).toBe(downloadLinkMock)
    })
  })
})

describe('events', function () {
  test('downloadLinkClick', function () {
    const wrapper = shallowMount(UiMagazineFeatured)
    wrapper.get('.download-link').trigger('click')
    expect(wrapper.emitted().downloadLinkClick).toBeTruthy()
  })
})
