import ContainerSearchBar from '../ContainerSearchBar.vue'
import UISearchBar from '../UISearchBar.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  propsData: {
    sections: [
      { title: '文化', isFeatured: true },
      { name: 'videohub', isFeatured: true },
    ],
  },
})

describe('options computed', () => {
  test('get the proper data', () => {
    const wrapper = createWrapper(ContainerSearchBar)

    expect(wrapper.vm.options).toEqual([
      { title: '全部類別' },
      { title: '文化', isFeatured: true },
    ])
  })
})

describe('search feature', () => {
  test('set selectedOption when UISearchBar.vue emits setSelectedOption', () => {
    const wrapper = createWrapper(ContainerSearchBar)
    const option = { title: '全部類別' }

    wrapper.find(UISearchBar).vm.$emit('setSelectedOption', option)
    expect(wrapper.vm.selectedOption).toEqual(option)
  })

  test('set keyword when UISearchBar.vue emits setText', () => {
    const wrapper = createWrapper(ContainerSearchBar)
    const keyword = '明星'

    wrapper.find(UISearchBar).vm.$emit('setText', keyword)
    expect(wrapper.vm.keyword).toBe(keyword)
  })

  test('push proper router path when UISearchBar.vue emits search', () => {
    const $router = {
      push: jest.fn(),
    }
    const wrapper = createWrapper(ContainerSearchBar, {
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
