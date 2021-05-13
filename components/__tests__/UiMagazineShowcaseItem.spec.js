import { shallowMount } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import UiMagazineShowcaseItem from '../UiMagazineShowcaseItem.vue'
import UiMagazineShowcaseItemCoverImg from '../UiMagazineShowcaseItemCoverImg.vue'

describe('props', function () {
  test('coverImgUrl', async function () {
    const imgUrlMock = 'https://img.png'
    const wrapper = shallowMount(UiMagazineShowcaseItem, {
      propsData: {
        coverImgUrl: imgUrlMock,
      },
    })
    await flushPromises()
    expect(
      wrapper.getComponent(UiMagazineShowcaseItemCoverImg).props().coverImgUrl
    ).toBe(imgUrlMock)
  })
  test('label', function () {
    const labelMock = '2020/12/30'
    const wrapper = shallowMount(UiMagazineShowcaseItem, {
      propsData: {
        label: labelMock,
      },
    })
    expect(wrapper.get('.label').text()).toBe(labelMock)
  })
  test('title', function () {
    const titleMock = 'title'
    const wrapper = shallowMount(UiMagazineShowcaseItem, {
      propsData: {
        title: titleMock,
      },
    })
    expect(wrapper.get('.title').text()).toBe(titleMock)
  })
  test('downloadLink', function () {
    const downloadLinkMock = 'http://download'
    const wrapper = shallowMount(UiMagazineShowcaseItem, {
      propsData: {
        downloadLink: downloadLinkMock,
      },
    })
    expect(wrapper.attributes().href).toBe(downloadLinkMock)
  })
})

describe('events', function () {
  test('downloadLinkClick', function () {
    const wrapper = shallowMount(UiMagazineShowcaseItem)
    wrapper.trigger('click')
    expect(wrapper.emitted().downloadLinkClick).toBeTruthy()
  })
})
