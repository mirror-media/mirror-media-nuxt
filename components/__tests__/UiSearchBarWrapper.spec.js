import UiSearchBarWrapper from '../UiSearchBarWrapper.vue'
import UiSearchBar from '../UiSearchBar.vue'
import UiSearchBarDesktop from '../UiSearchBarDesktop.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  propsData: {
    options: [],
  },
})

describe('search feature', () => {
  test('set keyword when UiSearchBar.vue emits setText', () => {
    const wrapper = createWrapper(UiSearchBarWrapper)
    const keyword = '明星'

    wrapper.findComponent(UiSearchBar).vm.$emit('setText', keyword)
    expect(wrapper.vm.keyword).toBe(keyword)
  })
})
describe('emitGa method', () => {
  test('emit sendGa when UiSearchBarDesktop.vue emits sendGa', () => {
    const wrapper = createWrapper(UiSearchBarWrapper)

    const gaArgs = {
      eventCategory: 'header',
      eventAction: 'click',
      eventLabel: 'search',
    }
    wrapper.findComponent(UiSearchBarDesktop).vm.$emit('sendGa', gaArgs)
    expect(wrapper.emitted().sendGa[0]).toEqual([gaArgs])
  })
})
