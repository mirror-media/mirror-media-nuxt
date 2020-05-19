import UIOthersLink from '../UIOthersLink.vue'
import { SOCIAL_LINK } from '~/constants/index'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const mockLink = {
  textContent: '訂閱鏡週刊',
  href: SOCIAL_LINK.SUBSCRIBE,
  ga: {
    eventLabel: 'more subscribe',
  },
}

const createWrapper = createWrapperHelper({
  propsData: {
    links: [mockLink],
  },
})

describe('link list', () => {
  test('render the proper other link', () => {
    const wrapper = createWrapper(UIOthersLink, {
      data() {
        return {
          isLinkList: true,
        }
      },
    })

    const link = wrapper.find(`[href="${mockLink.href}"]`)
    expect(link.text()).toBe(mockLink.textContent)
  })

  test('toggle the link list when a user clicks the more icon', async () => {
    const wrapper = createWrapper(UIOthersLink)

    const moreIcon = wrapper.find('.more-icon')
    moreIcon.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.link-list').exists()).toBe(true)

    moreIcon.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.link-list').exists()).toBe(false)
  })

  test('close the link list when a user clicks outside', async () => {
    const wrapper = createWrapper(UIOthersLink, {
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
  test('with a proper argument when user clicks a other link', () => {
    const wrapper = createWrapper(UIOthersLink, {
      data() {
        return {
          isLinkList: true,
        }
      },
    })

    const link = wrapper.find(`[href="${mockLink.href}"]`)
    link.trigger('click')
    expect(wrapper.emitted().sendGA[0]).toEqual([
      {
        eventCategory: 'header',
        eventAction: 'click',
        eventLabel: mockLink.ga.eventLabel,
      },
    ])
  })

  test('with a proper argument when a user clicks the more icon', () => {
    const wrapper = createWrapper(UIOthersLink)

    const moreIcon = wrapper.find('.more-icon')
    moreIcon.trigger('click')
    expect(wrapper.emitted().sendGA[0]).toEqual([
      {
        eventCategory: 'header',
        eventAction: 'click',
        eventLabel: 'more open',
      },
    ])
  })
})
