import UIStoryVideo from '../UIStoryVideo.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper()

describe('props', () => {
  test('should has proper section class', () => {
    const idMock = 'test'
    const fileTypeMock = 'video/mp4'
    const urlMock = 'test'
    const wrapper = createWrapper(UIStoryVideo, {
      propsData: {
        video: {
          id: idMock,
          filetype: fileTypeMock,
          url: urlMock,
        },
      },
    })
    expect(wrapper.get(`.story-video video`).attributes().id).toBe(
      `video-${idMock}`
    )
    expect(wrapper.get(`.story-video video source`).attributes().src).toBe(
      urlMock
    )
    expect(wrapper.get(`.story-video video source`).attributes().type).toBe(
      fileTypeMock
    )
  })
})
