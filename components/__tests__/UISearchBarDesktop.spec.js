import UISearchBarDesktop from '../UISearchBarDesktop.vue'
import UISearchBarSelect from '../UISearchBarSelect.vue'
import UISearchBarInput from '../UISearchBarInput.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  propsData: {
    options: [],
  },
})

describe('custom events', () => {
  test('emit setText when UISearchBarInput.vue emits setText', () => {
    const wrapper = createWrapper(UISearchBarDesktop)
    const keyword = '明星'

    wrapper.findComponent(UISearchBarInput).vm.$emit('setText', keyword)
    expect(wrapper.emitted().setText[0]).toEqual([keyword])
  })

  test('emit search when UISearchBarInput.vue emits search', () => {
    const wrapper = createWrapper(UISearchBarDesktop)

    wrapper.findComponent(UISearchBarInput).vm.$emit('search')
    expect(wrapper.emitted().search).toBeTruthy()
  })

  test('emit setSelectedOption when UISearchBarSelect.vue emits setSelectedOption', () => {
    const wrapper = createWrapper(UISearchBarDesktop)
    const option = { title: '全部類別' }

    wrapper
      .findComponent(UISearchBarSelect)
      .vm.$emit('setSelectedOption', option)
    expect(wrapper.emitted().setSelectedOption[0]).toEqual([option])
  })

  test('emit search when users click the search icon', () => {
    const wrapper = createWrapper(UISearchBarDesktop)

    const searchIcon = wrapper.find('.search-icon')
    searchIcon.trigger('click')
    expect(wrapper.emitted().search).toBeTruthy()
  })
})

describe('emitGA method', () => {
  test('with a proper argument when users click the search icon', () => {
    const wrapper = createWrapper(UISearchBarDesktop)

    const searchIcon = wrapper.find('.search-icon')
    searchIcon.trigger('click')
    expect(wrapper.emitted().sendGA[0]).toEqual([
      {
        eventCategory: 'header',
        eventAction: 'click',
        eventLabel: 'search',
      },
    ])
  })
})
