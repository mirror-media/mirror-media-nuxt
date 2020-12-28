import createWrapperHelper from '~/test/helpers/createWrapperHelper'
import UiMembershipDropdownMenu from '~/components/UiMembershipDropdownMenu.vue'

const createWrapper = createWrapperHelper({
  propsData: {
    options: [],
  },
})

describe('placeholder props', function () {
  test('should show the default placeholder if we do not provide any value to placeholder props', function () {
    const wrapper = createWrapper(UiMembershipDropdownMenu)
    const activeItemText = wrapper.get('.active-item__placeholder')
    expect(activeItemText.text()).toBe('請選擇')
  })
  test('should show the placeholder which we provide to placeholder props', function () {
    const mockPlaceholder = 'placeholder'
    const wrapper = createWrapper(UiMembershipDropdownMenu, {
      propsData: {
        placeholder: mockPlaceholder,
      },
    })
    const activeItemText = wrapper.get('.active-item__placeholder')
    expect(activeItemText.text()).toBe(mockPlaceholder)
  })
})

test('should render ".option-list-item" by the options array props, and the text is the value of each element in array', function () {
  const mockOptions = ['first', 'second', 'third']
  const wrapper = createWrapper(UiMembershipDropdownMenu, {
    propsData: {
      options: mockOptions,
    },
  })
  const optionListItems = wrapper.findAll('.option-list-item')
  optionListItems.wrappers.forEach(function assertOptionListItemText(
    optionListItem,
    i
  ) {
    expect(optionListItem.text()).toBe(mockOptions[i])
  })
})

describe('conditional rendering of the option list', function () {
  test('should hide the option list by default', function () {
    const wrapper = createWrapper(UiMembershipDropdownMenu)
    expect(wrapper.get('.option-list').element.style.display).toBe('none')
  })

  test('should show the option list after we click the active item', async function () {
    expect.assertions(1)
    const wrapper = createWrapper(UiMembershipDropdownMenu)
    await wrapper.get('.active-item').trigger('click')
    expect(wrapper.get('.option-list').element.style.display).not.toBe('none')
  })
})

test('should show the select option value and hide the option list after we click one of the item in option list', async function () {
  expect.assertions(4)
  const mockOptionsFirst = 'first'
  const mockOptions = [mockOptionsFirst]
  const wrapper = createWrapper(UiMembershipDropdownMenu, {
    propsData: {
      options: mockOptions,
    },
  })
  await wrapper.get('.active-item').trigger('click')
  await wrapper.get('.option-list-item').trigger('click')
  const activeItemText = wrapper.get('.active-item__placeholder')
  expect(activeItemText.text()).toBe(mockOptionsFirst)
  expect(activeItemText.classes()).toContain('active-item__placeholder--black')
  expect(wrapper.get('.option-list').element.style.display).toBe('none')
  expect(wrapper.emitted().change[0]).toEqual([mockOptionsFirst])
})

describe('behaviors about the state props is disable', function () {
  test('should not show the option list even if we click the active item, if state props is disable', async function () {
    const wrapper = createWrapper(UiMembershipDropdownMenu, {
      propsData: {
        state: 'disable',
      },
    })
    await wrapper.get('.active-item').trigger('click')
    expect(wrapper.get('.option-list').element.style.display).toBe('none')
  })
  test('should contain disable modifier in the class of the active item, if state props is disable', function () {
    const wrapper = createWrapper(UiMembershipDropdownMenu, {
      propsData: {
        state: 'disable',
      },
    })
    expect(wrapper.get('.active-item').classes()).toContain(
      'active-item--disable'
    )
  })
})

describe('behaviors about the state props is invalid', function () {
  test('should contain invalid modifier in the class of the active item, if state props is invalid', function () {
    const wrapper = createWrapper(UiMembershipDropdownMenu, {
      propsData: {
        state: 'invalid',
      },
    })
    expect(wrapper.get('.active-item').classes()).toContain(
      'active-item--invalid'
    )
  })
})

describe('height props', function () {
  test('should apply the height to the active item which we provide to height props', function () {
    const mockHeight = 90
    const wrapper = createWrapper(UiMembershipDropdownMenu, {
      propsData: {
        height: mockHeight,
      },
    })
    expect(wrapper.get('.active-item').element.style.height).toBe(
      `${mockHeight}px`
    )
  })
  test('should apply the height to the active item which we provide to height props', function () {
    const mockHeight = 90
    const wrapper = createWrapper(UiMembershipDropdownMenu, {
      propsData: {
        height: mockHeight,
      },
    })
    const optionListItems = wrapper.findAll('.option-list-item')
    optionListItems.wrappers.forEach(function assertOptionListItemHeight(
      optionListItem
    ) {
      expect(optionListItem.element.style.height).toBe(`${mockHeight}px`)
    })
  })
  test('should apply the maxHeight and the top to the option list which related to the height props we provide', function () {
    const mockHeight = 90
    const wrapper = createWrapper(UiMembershipDropdownMenu, {
      propsData: {
        height: mockHeight,
      },
    })
    expect(wrapper.get('.option-list').element.style.maxHeight).toBe(
      `${mockHeight * 4}px`
    )
    expect(wrapper.get('.option-list').element.style.top).toBe(
      `${mockHeight}px`
    )
  })
})

test('should select the default option if defaultIndex props was provided', function () {
  const mockDefaultSelectedOptionIndex = 1
  const mockDefaultValue = 'default'
  const mockOptions = ['0', mockDefaultValue, '2']
  const wrapper = createWrapper(UiMembershipDropdownMenu, {
    propsData: {
      options: mockOptions,
      defaultIndex: mockDefaultSelectedOptionIndex,
    },
  })
  expect(wrapper.get('.active-item__placeholder').text()).toBe(mockDefaultValue)
})
