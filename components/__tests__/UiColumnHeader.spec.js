import UiColumnHeader from '../UiColumnHeader.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const mockTitle = '焦點新聞'
const createWrapper = createWrapperHelper({
  propsData: {
    title: mockTitle,
  },
})

test('render the proper title', () => {
  const wrapper = createWrapper(UiColumnHeader)

  expect(wrapper.get('h2').text()).toBe(mockTitle)
})
