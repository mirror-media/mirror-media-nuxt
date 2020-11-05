import UIStoryVideo from '../UIStoryVideo.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper()

describe('props', () => {
  test('should has proper section class', () => {
    const urlMock = 'test'
    const wrapper = createWrapper(UIStoryVideo, {
      propsData: {
        video: {
          url: urlMock,
        },
      },
    })

    expect(wrapper.get('video').attributes().src).toBe(urlMock)
  })
})
