import UiYoutubeSubscribe from '../../deprecated/topic-page/components/UiYoutubeSubscribe.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const channelId = 'UCYkldEK001GxR884OZMFnRw'
const channelName = 'media'
const channelTitle = '鏡週刊'
const createWrapper = createWrapperHelper({
  propsData: {
    channelId,
    channelName,
    channelTitle,
  },
})

describe('subscribe div container', () => {
  const wrapper = createWrapper(UiYoutubeSubscribe)
  const subscribeBtn = wrapper.find('.g-ytsubscribe')

  test('should exist element with g-ytsubscribe classname ', () => {
    expect(subscribeBtn.exists()).toBe(true)
  })

  test('should render proper data-channelid', () => {
    expect(subscribeBtn.attributes()['data-channelid']).toBe(channelId)
  })

  test('should has data-count attribute with hidden value', () => {
    expect(subscribeBtn.attributes()['data-count']).toBe('hidden')
  })
})
