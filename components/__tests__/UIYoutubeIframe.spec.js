import UIYoutubeIframe from '../UIYoutubeIframe.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const videoId = 'TX1NNUXnETY'
const createWrapper = createWrapperHelper({
  propsData: {
    videoId,
  },
})

describe('iframe', () => {
  test('should render correct iframe src', () => {
    const wrapper = createWrapper(UIYoutubeIframe)
    const iframe = wrapper.get('iframe')
    expect(iframe.attributes().src).toBe(
      `https://www.youtube.com/embed/${videoId}`
    )
  })
})
