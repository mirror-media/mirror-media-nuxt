import _ from 'lodash'
import UIOthersList from '../UIOthersList.vue'
import { OTHER_LINKS } from '~/constants/index'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const otherLinksEventLabel = {
  subscribe: {
    eventLabel: 'more subscribe',
  },
  magazine: {
    eventLabel: 'more magazine',
  },
  auth: {
    eventLabel: 'more auth',
  },
  ad: {
    eventLabel: 'more ad',
  },
  campaign: {
    eventLabel: 'more campaign',
  },
  downloadApp: {
    eventLabel: 'more download',
  },
}
const eventCategory = 'header'
const otherLinks = _.merge(OTHER_LINKS, otherLinksEventLabel)

const createWrapper = createWrapperHelper({
  propsData: {
    links: otherLinks,
    eventCategory,
  },
})

describe('link list', () => {
  test('toggle the link list when users click the more icon', async () => {
    const wrapper = createWrapper(UIOthersList)

    const moreIcon = wrapper.find('.more-icon')
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

    await document.body.dispatchEvent(new Event('click'))
    expect(wrapper.find('.link-list').exists()).toBe(false)
  })
})

describe('emitGA method', () => {
  test('with a proper argument when users click a other link', () => {
    const wrapper = createWrapper(UIOthersList, {
      data() {
        return {
          isLinkList: true,
        }
      },
    })
    const { href, eventLabel } = otherLinks.subscribe

    const link = wrapper.find(`[href="${href}"]`)
    link.trigger('click')
    expect(wrapper.emitted().sendGA[0]).toEqual([
      {
        eventCategory,
        eventAction: 'click',
        eventLabel,
      },
    ])
  })

  test('with a proper argument when users click the more icon', () => {
    const wrapper = createWrapper(UIOthersList)

    const moreIcon = wrapper.find('.more-icon')
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
