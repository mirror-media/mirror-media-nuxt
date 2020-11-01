import ContainerAudioPlayer from '../ContainerAudioPlayer.vue'
import UIAudioPlayerInfo from '../UIAudioPlayerInfo.vue'
import UIAudioPlayerBar from '../UIAudioPlayerBar.vue'
import UIAudioPlayerTime from '../UIAudioPlayerTime.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

beforeAll(function mockMedia() {
  const methods = ['play', 'pause']

  methods.forEach((key) => {
    Object.defineProperty(window.HTMLMediaElement.prototype, key, {
      value() {},
    })
  })
})

const mockContent = {
  url:
    'https://www.mirrormedia.com.tw/assets/audios/20200821155644-aaa56a6088d4b4afd6867be35ea58c4d.mp3',
  title: '英國鄉村獸醫的跨州動物救援檔案',
}

const createWrapper = createWrapperHelper({
  propsData: {
    content: mockContent,
  },
})

describe('prop "content"', () => {
  test('set the correct src of the audio', () => {
    const wrapper = createWrapper(ContainerAudioPlayer)

    expect(wrapper.vm.$refs.audio.src).toBe(mockContent.url)
  })

  test('set the correct prop "title" of the UIAudioPlayerInfo', () => {
    const wrapper = createWrapper(ContainerAudioPlayer)

    expect(wrapper.findComponent(UIAudioPlayerInfo).props().title).toBe(
      mockContent.title
    )
  })
})

describe('play button', () => {
  test('get the correct alt initially', () => {
    const wrapper = createWrapper(ContainerAudioPlayer)

    expect(wrapper.get('.controls img').attributes().alt).toBe('play')
  })

  test('toggle the audio & alt when users click the button', async () => {
    const wrapper = createWrapper(ContainerAudioPlayer, {
      mocks: {
        $ga: {
          event: jest.fn(),
        },
      },
    })

    const audioPlay = jest.spyOn(window.HTMLMediaElement.prototype, 'play')
    const audioPause = jest.spyOn(window.HTMLMediaElement.prototype, 'pause')

    const playBtn = wrapper.get('.controls button')
    const playImg = wrapper.get('.controls img')

    await playBtn.trigger('click')

    expect(audioPlay).toBeCalled()
    expect(playImg.attributes().alt).toBe('pause')

    await playBtn.trigger('click')

    expect(audioPause).toBeCalled()
    expect(playImg.attributes().alt).toBe('play')

    audioPlay.mockRestore()
    audioPause.mockRestore()
  })

  test('pause the audio when it is ended', async () => {
    const wrapper = createWrapper(ContainerAudioPlayer, {
      mocks: {
        $ga: {
          event: jest.fn(),
        },
      },
    })

    await wrapper.get('.controls button').trigger('click')
    await wrapper.vm.$refs.audio.dispatchEvent(new Event('ended'))

    expect(wrapper.get('.controls img').attributes().alt).toBe('play')
  })
})

describe('audio status', () => {
  test('set the "duration" when a durationchange event occurs', async () => {
    const wrapper = createWrapper(ContainerAudioPlayer)
    const {
      $refs: { audio },
      audioStatus,
    } = wrapper.vm
    const mockDuration = 6

    Object.defineProperty(audio, 'duration', {
      value: mockDuration,
    })

    await audio.dispatchEvent(new Event('durationchange'))

    expect(audioStatus.duration).toBe(mockDuration)
  })

  test('set the "currentTime" when a timeupdate event occurs', async () => {
    await applyTestToCurrentTime('timeupdate')
  })

  test('set the "currentTime" when a seeking event occurs', async () => {
    await applyTestToCurrentTime('seeking')
  })

  test('set the "loadedTime" when a progress event occurs', async () => {
    await applyTestToLoadedTime('progress')
  })

  test('set the "loadedTime" when a loadedmetadata event occurs', async () => {
    await applyTestToLoadedTime('loadedmetadata')
  })

  test('set the "loadedTime" when a timeupdate event occurs', async () => {
    await applyTestToLoadedTime('timeupdate')
  })

  async function applyTestToCurrentTime(evtType) {
    const wrapper = createWrapper(ContainerAudioPlayer)
    const {
      $refs: { audio },
      audioStatus,
    } = wrapper.vm
    const mockCurrentTime = 3

    audio.currentTime = mockCurrentTime

    // 避免 UIAudioPlayerBar 針對 prop 'value' 自定義的 validator 檢查失敗
    audioStatus.duration = 6

    await audio.dispatchEvent(new Event(evtType))

    expect(audioStatus.currentTime).toBe(mockCurrentTime)
  }

  async function applyTestToLoadedTime(evtType) {
    const wrapper = createWrapper(ContainerAudioPlayer)
    const {
      $refs: { audio },
      audioStatus,
    } = wrapper.vm
    const mockLoadedTime = 1.5

    Object.defineProperty(audio, 'buffered', {
      value: {
        length: 1,
        end: () => mockLoadedTime,
      },
    })

    await audio.dispatchEvent(new Event(evtType))

    expect(audioStatus.loadedTime).toBe(mockLoadedTime)
  }
})

describe('audio player bar', () => {
  test('get correct value', async () => {
    const wrapper = createWrapper(ContainerAudioPlayer)
    const audioPlayerBar = wrapper.findComponent(UIAudioPlayerBar)

    expect(audioPlayerBar.props().value).toBe(0)

    await wrapper.setData({
      audioStatus: {
        duration: 1150.872,
        currentTime: 383.624,
      },
    })

    expect(audioPlayerBar.props().value).toBe(0.333)
  })

  test('get correct rail (buffered) style', async () => {
    const wrapper = createWrapper(ContainerAudioPlayer)
    const audioPlayerBar = wrapper.findComponent(UIAudioPlayerBar)

    expect(audioPlayerBar.props().railStyle).toEqual({
      backgroundImage: 'linear-gradient(90deg, #7d7d7d 0%, #000 0%)',
    })

    await wrapper.setData({
      audioStatus: {
        duration: 1150.872,
        loadedTime: 383.624,
      },
    })

    expect(audioPlayerBar.props().railStyle).toEqual({
      backgroundImage: 'linear-gradient(90deg, #7d7d7d 33.333%, #000 33.333%)',
    })
  })

  test('set the "audio.currentTime" when the UIAudioPlayerBar emits an "update:value"', () => {
    const mockDuration = 100
    const mockValue = 0.6
    const wrapper = createWrapper(ContainerAudioPlayer, {
      data() {
        return {
          audioStatus: {
            duration: mockDuration,
          },
        }
      },
    })

    wrapper.findComponent(UIAudioPlayerBar).vm.$emit('update:value', mockValue)

    expect(wrapper.vm.$refs.audio.currentTime).toBe(mockDuration * mockValue)
  })
})

describe('audio player time', () => {
  test('get the correct formatted time', () => {
    const wrapper = createWrapper(ContainerAudioPlayer, {
      data() {
        return {
          audioStatus: {
            duration: 1150.872,
            currentTime: 383.624,
          },
        }
      },
    })

    const audioPlayerTime = wrapper.findComponent(UIAudioPlayerTime)

    expect(audioPlayerTime.props().duration).toBe('19:10')
    expect(audioPlayerTime.props().currentTime).toBe('06:23')
  })
})

describe('GA event', () => {
  test('all the $ga method when users play the audio', () => {
    const $ga = {
      event: jest.fn(),
    }
    const wrapper = createWrapper(ContainerAudioPlayer, {
      mocks: { $ga },
    })

    wrapper.get('.controls button').trigger('click')

    expect($ga.event).toBeCalledWith({
      eventCategory: 'article',
      eventAction: 'click',
      eventLabel: 'voice-play',
    })
  })
})
