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
  test('set selectedOption when UiSearchBar.vue emits setSelectedOption', () => {
    const wrapper = createWrapper(UiSearchBarWrapper)
    const option = { title: '全部類別' }

    wrapper.findComponent(UiSearchBar).vm.$emit('setSelectedOption', option)
    expect(wrapper.vm.selectedOption).toEqual(option)
  })

  test('set keyword when UiSearchBar.vue emits setText', () => {
    const wrapper = createWrapper(UiSearchBarWrapper)
    const keyword = '明星'

    wrapper.findComponent(UiSearchBar).vm.$emit('setText', keyword)
    expect(wrapper.vm.keyword).toBe(keyword)
  })

  test('push proper router path when UiSearchBar.vue emits search', () => {
    const $router = {
      push: jest.fn(),
    }
    const wrapper = createWrapper(UiSearchBarWrapper, {
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
    const searchBarVM = wrapper.findComponent(UiSearchBar).vm

    delete window.location
    window.location = {
      assign: jest.fn(),
    }

    searchBarVM.$emit('search')

    // expect($router.push).toBeCalledWith('/search/明星')
    expect(window.location.assign).toBeCalledWith('/search/明星')

    jest.clearAllMocks()
    wrapper.setData({
      keyword: '',
    })
    searchBarVM.$emit('search')

    // expect($router.push).not.toBeCalled()
    expect(window.location.assign).not.toBeCalled()

    jest.clearAllMocks()
    wrapper.setData({
      keyword: '明星 媒體',
    })
    searchBarVM.$emit('search')

    // expect($router.push).toBeCalledWith('/search/明星,媒體')
    expect(window.location.assign).toBeCalledWith('/search/明星,媒體')

    jest.clearAllMocks()
    wrapper.setData({
      keyword: ' 明星  媒體   ',
    })
    searchBarVM.$emit('search')

    // expect($router.push).toBeCalledWith('/search/明星,媒體')
    expect(window.location.assign).toBeCalledWith('/search/明星,媒體')

    jest.clearAllMocks()
    wrapper.setData({
      keyword: '明星, 媒體',
    })
    searchBarVM.$emit('search')

    // expect($router.push).toBeCalledWith('/search/明星,媒體')
    expect(window.location.assign).toBeCalledWith('/search/明星,媒體')

    jest.clearAllMocks()
    wrapper.setData({
      selectedOption: { title: '娛樂', id: '57e1e11cee85930e00cad4ea' },
    })
    searchBarVM.$emit('search')

    // expect($router.push).toBeCalledWith(
    //   '/search/明星,媒體?section=57e1e11cee85930e00cad4ea'
    // )
    expect(window.location.assign).toBeCalledWith(
      '/search/明星,媒體?section=57e1e11cee85930e00cad4ea'
    )
  })
})

describe('emitGA method', () => {
  test('emit sendGA when UiSearchBarDesktop.vue emits sendGA', () => {
    const wrapper = createWrapper(UiSearchBarWrapper)

    const gaArgs = {
      eventCategory: 'header',
      eventAction: 'click',
      eventLabel: 'search',
    }
    wrapper.findComponent(UiSearchBarDesktop).vm.$emit('sendGA', gaArgs)
    expect(wrapper.emitted().sendGA[0]).toEqual([gaArgs])
  })
})
