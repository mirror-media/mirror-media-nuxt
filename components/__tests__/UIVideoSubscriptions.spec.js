import UIVideoSubscriptions from '../UIVideoSubscriptions.vue'
import UIYoutubeSubscribe from '../UIYoutubeSubscribe.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper()

describe('channels', () => {
  test('should render proper number of UIYoutubeSubscribe', () => {
    const wrapper = createWrapper(UIVideoSubscriptions)
    const channels = wrapper.findAllComponents(UIYoutubeSubscribe)
    expect(channels).toHaveLength(5)
  })
})
