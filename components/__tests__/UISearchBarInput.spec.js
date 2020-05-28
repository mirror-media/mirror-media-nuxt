import UISearchBarInput from '../UISearchBarInput.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper()

const keyword = '明星'

describe('input feature', () => {
  test('emit the text when users type', async () => {
    const wrapper = createWrapper(UISearchBarInput)

    await wrapper.get('input').setValue(keyword)
    expect(wrapper.emitted().setText[0]).toEqual([keyword])
  })

  test('emit search when users press the Enter key', () => {
    const wrapper = createWrapper(UISearchBarInput)
    const input = wrapper.get('input')

    input.trigger('keydown.enter', {
      isComposing: true,
    })
    expect(wrapper.emitted().search).toBeFalsy()

    input.trigger('keydown.enter')
    expect(wrapper.emitted().search).toBeTruthy()
  })
})
