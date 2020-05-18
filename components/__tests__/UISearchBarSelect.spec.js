import UISearchBarSelect from '../UISearchBarSelect.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  propsData: {
    options: [{ title: '全部類別' }, { title: '文化' }],
  },
})

describe('select feature', () => {
  test('render the proper options', () => {
    const wrapper = createWrapper(UISearchBarSelect)
    const optionField = wrapper.find('.option-filed')

    expect(optionField.find('li:nth-child(1)').text()).toBe('全部類別')
    expect(optionField.find('li:nth-child(2)').text()).toBe('文化')
  })

  test('select the first option in the beginning', () => {
    const wrapper = createWrapper(UISearchBarSelect, {
      data() {
        return {
          isOptionField: true,
        }
      },
    })

    expect(wrapper.find('.displayed-field').text()).toBe('全部類別')
    expect(
      wrapper.find('.option-filed li:first-child').classes('selected')
    ).toBe(true)
  })

  test('toggle the option field when user clicks the displayed field', async () => {
    const wrapper = createWrapper(UISearchBarSelect)
    const displayedField = wrapper.find('.displayed-field')

    displayedField.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.option-filed').element.style.display).toBe('')

    displayedField.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.option-filed').element.style.display).toBe('none')
  })

  test('behave correctly when user selects an option', async () => {
    const wrapper = createWrapper(UISearchBarSelect, {
      data() {
        return {
          isOptionField: true,
        }
      },
    })

    wrapper.find('.option-filed li:nth-child(2)').trigger('click')
    await wrapper.vm.$nextTick()
    expect(
      wrapper.find('.option-filed li:nth-child(2)').classes('selected')
    ).toBe(true)

    const displayedField = wrapper.find('.displayed-field')
    expect(displayedField.text()).toBe('文化')

    expect(wrapper.find('.option-filed').element.style.display).toBe('none')
  })

  test('emit the option when an option is selected', async () => {
    const wrapper = createWrapper(UISearchBarSelect, {
      data() {
        return {
          isOptionField: true,
        }
      },
    })
    expect(wrapper.emitted().setSelectedOption[0]).toEqual([
      { title: '全部類別' },
    ])

    wrapper.find('.option-filed li:nth-child(2)').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().setSelectedOption[1]).toEqual([{ title: '文化' }])
  })

  test('hide the option field when user clicks outside', async () => {
    const wrapper = createWrapper(UISearchBarSelect, {
      data() {
        return {
          isOptionField: true,
        }
      },
    })

    document.body.dispatchEvent(new Event('click'))
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.option-filed').element.style.display).toBe('none')
  })
})
