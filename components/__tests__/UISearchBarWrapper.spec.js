import UISearchBarWrapper from '../UISearchBarWrapper.vue'
import UISearchBar from '../UISearchBar.vue'
import UISearchBarDesktop from '../UISearchBarDesktop.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  propsData: {
    options: [],
  },
})

describe('search feature', () => {
  test('set selectedOption when UISearchBar.vue emits setSelectedOption', () => {
    const wrapper = createWrapper(UISearchBarWrapper)
    const option = { title: '全部類別' }

    wrapper.find(UISearchBar).vm.$emit('setSelectedOption', option)
    expect(wrapper.vm.selectedOption).toEqual(option)
  })

  test('set keyword when UISearchBar.vue emits setText', () => {
    const wrapper = createWrapper(UISearchBarWrapper)
    const keyword = '明星'

    wrapper.find(UISearchBar).vm.$emit('setText', keyword)
    expect(wrapper.vm.keyword).toBe(keyword)
  })

  test('push proper router path when UISearchBar.vue emits search', () => {
    const $router = {
      push: jest.fn(),
    }
    const wrapper = createWrapper(UISearchBarWrapper, {
      data() {
        return {
          selectedOption: { title: '全部類別' },
          keyword: '明星',
        }
      },
      mocks: {
        $router,
      },
    })
    const searchBarVM = wrapper.find(UISearchBar).vm

    searchBarVM.$emit('search')
    expect($router.push).toBeCalledWith('/search/明星')

    jest.clearAllMocks()
    wrapper.setData({
      keyword: '',
    })
    searchBarVM.$emit('search')
    expect($router.push).not.toBeCalled()

    jest.clearAllMocks()
    wrapper.setData({
      keyword: '明星 媒體',
    })
    searchBarVM.$emit('search')
    expect($router.push).toBeCalledWith('/search/明星,媒體')

    jest.clearAllMocks()
    wrapper.setData({
      keyword: ' 明星  媒體   ',
    })
    searchBarVM.$emit('search')
    expect($router.push).toBeCalledWith('/search/明星,媒體')

    jest.clearAllMocks()
    wrapper.setData({
      keyword: '明星, 媒體',
    })
    searchBarVM.$emit('search')
    expect($router.push).toBeCalledWith('/search/明星,媒體')

    jest.clearAllMocks()
    wrapper.setData({
      selectedOption: { title: '娛樂', id: '57e1e11cee85930e00cad4ea' },
    })
    searchBarVM.$emit('search')
    expect($router.push).toBeCalledWith(
      '/search/明星,媒體?section=57e1e11cee85930e00cad4ea'
    )
  })
})

describe('emitGA method', () => {
  test('emit sendGA when UISearchBarDesktop.vue emits sendGA', () => {
    const wrapper = createWrapper(UISearchBarWrapper)

    const gaArgs = {
      eventCategory: 'header',
      eventAction: 'click',
      eventLabel: 'search',
    }
    wrapper.find(UISearchBarDesktop).vm.$emit('sendGA', gaArgs)
    expect(wrapper.emitted().sendGA[0]).toEqual([gaArgs])
  })
})
