import UISearchBarInput from '../UISearchBarInput.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper()

const keyword = '明星'

describe('input feature', () => {
  test('emit the text when user types', async () => {
    const wrapper = createWrapper(UISearchBarInput)

    wrapper.find('input').setValue(keyword)
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().inputText[0]).toEqual([keyword])
  })

  test('emit search when user releases the Enter key', async () => {
    const wrapper = createWrapper(UISearchBarInput)

    wrapper.find('input').trigger('keyup.enter')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted().search).toBeTruthy()
  })
})
