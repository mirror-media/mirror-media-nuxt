import UIOthersList from '../UIOthersList.vue'

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
  test('render the proper other link', () => {
    const wrapper = createWrapper(UIOthersList, {
      propsData: {
        links: [mockLink],
      },
      data() {
        return {
          isLinkList: true,
        }
      },
    })

    const link = wrapper.get(`[href="${mockLink.href}"]`)
    expect(link.text()).toBe(mockLink.title)
  })

  test('toggle the link list when users click the more icon', async () => {
    const wrapper = createWrapper(UIOthersList)

    const moreIcon = wrapper.get('.more-icon')
    await moreIcon.trigger('click')
    expect(wrapper.find('.link-list').exists()).toBe(true)

    await moreIcon.trigger('click')
    expect(wrapper.find('.link-list').exists()).toBe(false)
  })

  test('close the link list when users click outside', async () => {
    const wrapper = createWrapper(UIOthersList, {
      data() {
        return {
          isLinkList: true,
        }
      },
    })

    document.body.dispatchEvent(new Event('click'))
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.link-list').exists()).toBe(false)
  })
})

describe('emitGA method', () => {
  const eventCategory = 'header'

  test('with a proper argument when users click an other link', () => {
    const wrapper = createWrapper(UIOthersList, {
      propsData: {
        links: [mockLink],
        eventCategory,
      },
      data() {
        return {
          isLinkList: true,
        }
      },
    })

    const link = wrapper.get(`[href="${mockLink.href}"]`)
    link.trigger('click')
    expect(wrapper.emitted().sendGA[0]).toEqual([
      {
        eventCategory,
        eventAction: 'click',
        eventLabel: `more ${mockLink.name}`,
      },
    ])
  })

  test('with a proper argument when users click the more icon', () => {
    const wrapper = createWrapper(UIOthersList, {
      propsData: {
        eventCategory,
      },
    })

    const moreIcon = wrapper.get('.more-icon')
    moreIcon.trigger('click')
    expect(wrapper.emitted().sendGA[0]).toEqual([
      {
        eventCategory,
        eventAction: 'click',
        eventLabel: 'more open',
      },
    ])
  })
})
