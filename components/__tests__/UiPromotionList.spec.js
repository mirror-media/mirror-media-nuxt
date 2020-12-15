import UiPromotionList from '../UiPromotionList.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  propsData: {
    links: [],
    eventCategory: '',
  },
})

const mockLink = {
  name: 'subscribe',
  title: '訂閱鏡週刊',
  href:
    'https://docs.google.com/forms/d/1es1wqWfhwJn2sxDLc-6NRVokGn_fU0_M2YffhKMlcyM/viewform',
}

describe('link list', () => {
  test('render the proper promotion link', () => {
    const wrapper = createWrapper(UiPromotionList, {
      propsData: {
        links: [mockLink],
      },
      data() {
        return {
          shouldOpenList: true,
        }
      },
    })

    const link = wrapper.get(`[href="${mockLink.href}"]`)
    expect(link.text()).toBe(mockLink.title)
  })

  test('toggle the list when users click the more icon', async () => {
    const wrapper = createWrapper(UiPromotionList)

    const moreIcon = wrapper.get('.more-icon')
    await moreIcon.trigger('click')
    expect(wrapper.find('.wrapper').exists()).toBe(true)

    await moreIcon.trigger('click')
    expect(wrapper.find('.wrapper').exists()).toBe(false)
  })

  test('close the list when users click outside', async () => {
    const wrapper = createWrapper(UiPromotionList, {
      data() {
        return {
          shouldOpenList: true,
        }
      },
    })

    document.body.dispatchEvent(new Event('click'))
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.wrapper').exists()).toBe(false)
  })
})

describe('emitGa method', () => {
  const eventCategory = 'header'

  test('with a proper argument when users click a promotion link', () => {
    const wrapper = createWrapper(UiPromotionList, {
      propsData: {
        links: [mockLink],
        eventCategory,
      },
      data() {
        return {
          shouldOpenList: true,
        }
      },
    })

    const link = wrapper.get(`[href="${mockLink.href}"]`)
    link.trigger('click')
    expect(wrapper.emitted().sendGa[0]).toEqual([
      {
        eventCategory,
        eventAction: 'click',
        eventLabel: `more ${mockLink.name}`,
      },
    ])
  })

  test('with a proper argument when users click the more icon', () => {
    const wrapper = createWrapper(UiPromotionList, {
      propsData: {
        eventCategory,
      },
    })

    const moreIcon = wrapper.get('.more-icon')
    moreIcon.trigger('click')
    expect(wrapper.emitted().sendGa[0]).toEqual([
      {
        eventCategory,
        eventAction: 'click',
        eventLabel: 'more open',
      },
    ])
  })
})
