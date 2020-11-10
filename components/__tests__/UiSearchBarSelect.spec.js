import UiSearchBarSelect from '../UiSearchBarSelect.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  propsData: {
    options: [{ title: '全部類別' }, { title: '文化' }],
  },
})

describe('select feature', () => {
  test('render the proper options', () => {
    const wrapper = createWrapper(UiSearchBarSelect)
    const optionField = wrapper.get('.option-filed')

    expect(optionField.get('li:nth-child(1)').text()).toBe('全部類別')
    expect(optionField.get('li:nth-child(2)').text()).toBe('文化')
  })

  test('select the first option in the beginning', () => {
    const wrapper = createWrapper(UiSearchBarSelect, {
      data() {
        return {
          shouldShowOptionField: true,
        }
      },
    })

    expect(wrapper.get('.displayed-field').text()).toBe('全部類別')
    expect(
      wrapper.get('.option-filed li:first-child').classes('selected')
    ).toBe(true)
  })

  test('toggle the option field when users click the displayed field', async () => {
    const wrapper = createWrapper(UiSearchBarSelect)
    const displayedField = wrapper.get('.displayed-field')

    await displayedField.trigger('click')
    expect(wrapper.get('.option-filed').element.style.display).toBe('')

    await displayedField.trigger('click')
    expect(wrapper.get('.option-filed').element.style.display).toBe('none')
  })

  test('behave correctly when users select an option', async () => {
    const wrapper = createWrapper(UiSearchBarSelect, {
      data() {
        return {
          shouldShowOptionField: true,
        }
      },
    })

    await wrapper.get('.option-filed li:nth-child(2)').trigger('click')
    expect(
      wrapper.get('.option-filed li:nth-child(2)').classes('selected')
    ).toBe(true)

    const displayedField = wrapper.get('.displayed-field')
    expect(displayedField.text()).toBe('文化')

    expect(wrapper.get('.option-filed').element.style.display).toBe('none')
  })

  test('emit the option when an option is selected', async () => {
    const wrapper = createWrapper(UiSearchBarSelect, {
      data() {
        return {
          shouldShowOptionField: true,
        }
      },
    })
    expect(wrapper.emitted().setSelectedOption[0]).toEqual([
      { title: '全部類別' },
    ])

    await wrapper.get('.option-filed li:nth-child(2)').trigger('click')
    expect(wrapper.emitted().setSelectedOption[1]).toEqual([{ title: '文化' }])
  })

  test('hide the option field when users click outside', async () => {
    const wrapper = createWrapper(UiSearchBarSelect, {
      data() {
        return {
          shouldShowOptionField: true,
        }
      },
    })

    document.body.dispatchEvent(new Event('click'))
    await wrapper.vm.$nextTick()
    expect(wrapper.get('.option-filed').element.style.display).toBe('none')
  })
})
