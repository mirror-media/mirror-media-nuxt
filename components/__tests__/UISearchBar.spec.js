import UISearchBar from '../UISearchBar.vue'
import UISearchBarSelect from '../UISearchBarSelect.vue'
import UISearchBarInput from '../UISearchBarInput.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  propsData: {
    options: [],
  },
})

describe('custom events', () => {
  test('emit setSelectedOption when UISearchBarSelect.vue emits setSelectedOption', () => {
    const wrapper = createWrapper(UISearchBar)
    const option = { title: '全部類別' }

    wrapper.find(UISearchBarSelect).vm.$emit('setSelectedOption', option)
    expect(wrapper.emitted().setSelectedOption[0]).toEqual([option])
  })

  test('emit setText when UISearchBarInput.vue emits setText', () => {
    const wrapper = createWrapper(UISearchBar)
    const keyword = '明星'

    wrapper.find(UISearchBarInput).vm.$emit('setText', keyword)
    expect(wrapper.emitted().setText[0]).toEqual([keyword])
  })

  test('emit search when UISearchBarInput.vue emits search', () => {
    const wrapper = createWrapper(UISearchBar)

    wrapper.find(UISearchBarInput).vm.$emit('search')
    expect(wrapper.emitted().search).toBeTruthy()
  })
})

describe('search field', () => {
  test('toggle the field when user clicks the search icon', async () => {
    const wrapper = createWrapper(UISearchBar)

    const search = wrapper.find('.search')
    search.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.field').element.style.display).toBe('')

    search.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.field').element.style.display).toBe('none')
  })

  test('hide the field when user clicks outside', async () => {
    const wrapper = createWrapper(UISearchBar, {
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
