import UiVideoSubscriptions from '../UiVideoSubscriptions.vue'
import UiYoutubeSubscribe from '../UiYoutubeSubscribe.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper()

describe('channels', () => {
  test('should render proper number of UiYoutubeSubscribe', () => {
    const wrapper = createWrapper(UiVideoSubscriptions)
    const channels = wrapper.findAllComponents(UiYoutubeSubscribe)
    expect(channels).toHaveLength(6)
  })
})
