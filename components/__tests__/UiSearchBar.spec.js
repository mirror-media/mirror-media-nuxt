import UiSearchBar from '../UiSearchBar.vue'
import UiSearchBarInput from '../UiSearchBarInput.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  propsData: {
    options: [],
  },
})

describe('custom events', () => {
  test('emit setText when UiSearchBarInput.vue emits setText', () => {
    const wrapper = createWrapper(UiSearchBar)
    const keyword = '明星'

    wrapper.findComponent(UiSearchBarInput).vm.$emit('setText', keyword)
    expect(wrapper.emitted().setText[0]).toEqual([keyword])
  })

  test('emit search when UiSearchBarInput.vue emits search', () => {
    const wrapper = createWrapper(UiSearchBar)

    wrapper.findComponent(UiSearchBarInput).vm.$emit('search')
    expect(wrapper.emitted().search).toBeTruthy()
  })
})

describe('search field', () => {
  test('toggle the field when users click the search icon', async () => {
    const wrapper = createWrapper(UiSearchBar)

    const searchIcon = wrapper.get('.search-icon')
    await searchIcon.trigger('click')
    expect(wrapper.get('.field').element.style.display).toBe('')

    await searchIcon.trigger('click')
    expect(wrapper.get('.field').element.style.display).toBe('none')
  })

  test('hide the field when users click outside', async () => {
    const wrapper = createWrapper(UiSearchBar, {
      data() {
        return {
          shouldShowField: true,
        }
      },
    })

    document.body.dispatchEvent(new Event('click'))
    await wrapper.vm.$nextTick()
    expect(wrapper.get('.field').element.style.display).toBe('none')
  })
})
