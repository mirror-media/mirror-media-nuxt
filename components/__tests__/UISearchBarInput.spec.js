import UISearchBarInput from '../UISearchBarInput.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper()

const keyword = '明星'

describe('input feature', () => {
  test('emit the text when users type', async () => {
    const wrapper = createWrapper(UISearchBarInput)

    wrapper.find('input').setValue(keyword)
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().setText[0]).toEqual([keyword])
  })

  test('emit search when users press the Enter key', async () => {
    const wrapper = createWrapper(UISearchBarInput)
    const input = wrapper.find('input')

    input.trigger('keydown.enter', {
      isComposing: true,
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().search).toBeFalsy()

    input.trigger('keydown.enter')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().search).toBeTruthy()
  })
})
