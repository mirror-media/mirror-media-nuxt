import UiStoryVideo from '../UiStoryVideo.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper()

test('should render correct content', () => {
  const srcMock = 'https://www.google.com/1234/'
  const posterMock = 'https://www.google.com/5678/'
  const wrapper = createWrapper(UiStoryVideo, {
    propsData: {
      src: srcMock,
      poster: posterMock,
    },
  })

  const videoAttrs = wrapper.get('video').attributes()

  expect(videoAttrs.src).toBe(srcMock)
  expect(videoAttrs.poster).toBe(posterMock)
})
