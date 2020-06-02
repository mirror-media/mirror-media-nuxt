import { shallowMount } from '@vue/test-utils'
import UIVideoSubscriptions from '../UIVideoSubscriptions.vue'
import UIYoutubeSubscribe from '../UIYoutubeSubscribe.vue'

describe('channels', () => {
  test('should render proper number of UIYoutubeSubscribe', () => {
    const wrapper = shallowMount(UIVideoSubscriptions)
    const channels = wrapper.findAllComponents(UIYoutubeSubscribe)
    expect(channels).toHaveLength(5)
  })
})
