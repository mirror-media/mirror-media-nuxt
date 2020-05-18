import ContainerSearchBar from '../ContainerSearchBar.vue'
import UISearchBarSelect from '../UISearchBarSelect.vue'
import UISearchBarInput from '../UISearchBarInput.vue'
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
  test('set selectedOption when UISearchBarSelect.vue emits setSelectedOption', () => {
    const wrapper = createWrapper(ContainerSearchBar)
    const option = { title: '全部類別' }

    wrapper.find(UISearchBarSelect).vm.$emit('setSelectedOption', option)
    expect(wrapper.vm.selectedOption).toEqual(option)
  })

  test('set keyword when UISearchBarInput.vue emits setText', () => {
    const wrapper = createWrapper(ContainerSearchBar)
    const keyword = '明星'

    wrapper.find(UISearchBarInput).vm.$emit('setText', keyword)
    expect(wrapper.vm.keyword).toBe(keyword)
  })

  test('push proper router path when UISearchBarInput.vue emits search', () => {
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
    const searchBarInputVM = wrapper.find(UISearchBarInput).vm

    searchBarInputVM.$emit('search')
    expect($router.push).toBeCalledWith('/search/明星')

    jest.clearAllMocks()
    wrapper.setData({
      keyword: '',
    })
    searchBarInputVM.$emit('search')
    expect($router.push).not.toBeCalled()

    jest.clearAllMocks()
    wrapper.setData({
      keyword: '明星 媒體',
    })
    searchBarInputVM.$emit('search')
    expect($router.push).toBeCalledWith('/search/明星,媒體')

    jest.clearAllMocks()
    wrapper.setData({
      keyword: ' 明星  媒體   ',
    })
    searchBarInputVM.$emit('search')
    expect($router.push).toBeCalledWith('/search/明星,媒體')

    jest.clearAllMocks()
    wrapper.setData({
      selectedOption: { title: '娛樂', id: '57e1e11cee85930e00cad4ea' },
    })
    searchBarInputVM.$emit('search')
    expect($router.push).toBeCalledWith(
      '/search/明星,媒體?section=57e1e11cee85930e00cad4ea'
    )
  })
})

describe('search bar', () => {
  test('toggle the field when user clicks the search icon', async () => {
    const wrapper = createWrapper(ContainerSearchBar)

    const search = wrapper.find('.search')
    search.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.field').element.style.display).toBe('')

    search.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.field').element.style.display).toBe('none')
  })

  test('hide the field when user clicks outside', async () => {
    const wrapper = createWrapper(ContainerSearchBar, {
      data() {
        return {
          isField: true,
        }
      },
    })

    document.body.dispatchEvent(new Event('click'))
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.field').element.style.display).toBe('none')
  })
})
