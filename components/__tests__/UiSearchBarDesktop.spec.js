import UiSearchBarDesktop from '../UiSearchBarDesktop.vue'
import UiSearchBarInput from '../UiSearchBarInput.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  propsData: {
    options: [],
  },
})

describe('custom events', () => {
  test('emit setText when UiSearchBarInput.vue emits setText', () => {
    const wrapper = createWrapper(UiSearchBarDesktop)
    const keyword = '明星'

    wrapper.findComponent(UiSearchBarInput).vm.$emit('setText', keyword)
    expect(wrapper.emitted().setText[0]).toEqual([keyword])
  })

  test('emit search when UiSearchBarInput.vue emits search', () => {
    const wrapper = createWrapper(UiSearchBarDesktop)

    wrapper.findComponent(UiSearchBarInput).vm.$emit('search')
    expect(wrapper.emitted().search).toBeTruthy()
  })

  test('emit search when users click the search icon', () => {
    const wrapper = createWrapper(UiSearchBarDesktop)

    const searchIcon = wrapper.get('.search-icon')
    searchIcon.trigger('click')
    expect(wrapper.emitted().search).toBeTruthy()
  })
})

describe('emitGa method', () => {
  test('with a proper argument when users click the search icon', () => {
    const wrapper = createWrapper(UiSearchBarDesktop)

    const searchIcon = wrapper.get('.search-icon')
    searchIcon.trigger('click')
    expect(wrapper.emitted().sendGa[0]).toEqual([
      {
        eventCategory: 'header',
        eventAction: 'click',
        eventLabel: 'search',
      },
    ])
  })
})
