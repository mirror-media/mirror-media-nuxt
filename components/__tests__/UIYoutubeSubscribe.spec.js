import UIYoutubeSubscribe from '../UIYoutubeSubscribe.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const channelId = 'UCYkldEK001GxR884OZMFnRw'
const createWrapper = createWrapperHelper({
  propsData: {
    channelId,
  },
})

describe('subscribe div container', () => {
  const wrapper = createWrapper(UIYoutubeSubscribe)
  const subscribeBtn = wrapper.find('.g-ytsubscribe')

  test('should exist element with g-ytsubscribe classname ', () => {
    expect(subscribeBtn.exists()).toBe(true)
  })

  test('should render proper data-channelid', () => {
    expect(subscribeBtn.attributes()['data-channelid']).toBe(channelId)
  })

  test('should has data-layout attribute with full value', () => {
    expect(subscribeBtn.attributes()['data-layout']).toBe('full')
  })

  test('should has data-count attribute with hidden value', () => {
    expect(subscribeBtn.attributes()['data-count']).toBe('hidden')
  })
})
