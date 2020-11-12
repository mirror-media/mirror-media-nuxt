import UiAdultContentWarning from '../UiAdultContentWarning.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper()

describe('click event', () => {
  test('should emit click event', () => {
    const wrapper = createWrapper(UiAdultContentWarning)
    wrapper.get('.button.accepted').trigger('click')
    expect(wrapper.vm.showWarning).toBe(false)
  })
})
