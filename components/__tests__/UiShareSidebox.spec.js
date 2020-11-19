import UiShareSidebox from '../UiShareSidebox.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

let header, storyContainer, headerTopLayer

const createWrapper = createWrapperHelper({
  stubs: ['NuxtLink'],
})

describe('position of share sidebox', () => {
  const mockOffsetW = 1

  beforeAll(() => {
    mockRaf()

    jest
      .spyOn(window.HTMLElement.prototype, 'offsetWidth', 'get')
      .mockImplementation(() => mockOffsetW)
  })

  beforeEach(constructDom)
  afterEach(clearBody)
  afterAll(jest.restoreAllMocks)

  test('set the correct position initially', () => {
    const mockOffsetT = 43
    const mockOffsetH = 19
    const mockOffsetL = 53

    Object.defineProperties(header, {
      offsetTop: { value: mockOffsetT },
      offsetHeight: { value: mockOffsetH },
    })
    Object.defineProperty(storyContainer, 'offsetLeft', { value: mockOffsetL })

    const wrapper = createWrapper(UiShareSidebox)

    const { shareSidebox } = wrapper.vm.$refs

    expect(shareSidebox.style.top).toBe(`${mockOffsetT + mockOffsetH}px`)
    expect(shareSidebox.style.left).toBe(`${mockOffsetL - mockOffsetW}px`)
  })

  test('left should be 0px when left < 0', () => {
    Object.defineProperty(storyContainer, 'offsetLeft', { value: -19 })

    const wrapper = createWrapper(UiShareSidebox)

    expect(wrapper.vm.$refs.shareSidebox.style.left).toBe('0px')
  })

  test('set the position when a resize event ouucrs', async () => {
    await applyTestToPosition('resize')
  })

  test('set the position when a orientationChange event ouucrs', async () => {
    await applyTestToPosition('orientationChange')
  })

  async function applyTestToPosition(evtType) {
    const wrapper = createWrapper(UiShareSidebox)

    const mockOffsetT = 67
    const mockOffsetH = 79
    const mockOffsetL = 7

    Object.defineProperties(header, {
      offsetTop: { value: mockOffsetT },
      offsetHeight: { value: mockOffsetH },
    })
    Object.defineProperty(storyContainer, 'offsetLeft', { value: mockOffsetL })

    window.dispatchEvent(new Event(evtType))
    await wrapper.vm.$nextTick()

    const { shareSidebox } = wrapper.vm.$refs

    expect(shareSidebox.style.top).toBe(`${mockOffsetT + mockOffsetH}px`)
    expect(shareSidebox.style.left).toBe(`${mockOffsetL - mockOffsetW}px`)
  }
})

describe('logo', () => {
  beforeAll(mockRaf)
  beforeEach(constructDom)
  afterEach(clearBody)
  afterAll(jest.restoreAllMocks)

  test('show the logo when headerTopLayer.getBoundingClientRect().bottom <= 0', async () => {
    const wrapper = createWrapper(UiShareSidebox)

    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    const logo = wrapper.findComponent({ ref: 'logo' })

    expect(logo.classes('shown')).toBe(true)

    Object.defineProperty(headerTopLayer, 'getBoundingClientRect', {
      value: () => ({
        bottom: -7,
      }),
    })

    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    expect(logo.classes('shown')).toBe(true)
  })

  test('hide the logo when headerTopLayer.getBoundingClientRect().bottom > 0', async () => {
    const wrapper = createWrapper(UiShareSidebox)

    Object.defineProperty(headerTopLayer, 'getBoundingClientRect', {
      value: () => ({
        bottom: 17,
      }),
    })

    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent({ ref: 'logo' }).classes('shown')).toBe(false)
  })
})

describe('share url', () => {
  const lineSharedUrl = 'https://social-plugins.line.me/lineit/share?url='
  const fbSharedUrl = 'https://www.facebook.com/share.php?u='

  test('render the correct href under the condition that the prop "url" is undefined', async () => {
    const mockUrl = 'https://www.mirrormedia.mg/'

    jest.spyOn(window, 'location', 'get').mockImplementation(() => ({
      href: mockUrl,
    }))

    const wrapper = createWrapper(UiShareSidebox)
    await wrapper.vm.$nextTick()

    expect(wrapper.get('a:nth-child(2)').attributes().href).toBe(
      `${lineSharedUrl}${encodeURIComponent(mockUrl)}`
    )
    expect(wrapper.get('a:nth-child(3)').attributes().href).toBe(
      `${fbSharedUrl}${mockUrl}`
    )

    jest.restoreAllMocks()
  })

  test('render the correct href under the condition that the prop "url" is set"', async () => {
    const mockUrl1 = 'https://www.mirrormedia.mg/'
    const mockUrl2 = 'https://www.mirrormedia.mg/story/20200921ent009/'
    const wrapper = createWrapper(UiShareSidebox, {
      propsData: {
        url: mockUrl1,
      },
    })

    const lineLink = wrapper.get('a:nth-child(2)')
    const fbLink = wrapper.get('a:nth-child(3)')

    expect(lineLink.attributes().href).toBe(
      `${lineSharedUrl}${encodeURIComponent(mockUrl1)}`
    )
    expect(fbLink.attributes().href).toBe(`${fbSharedUrl}${mockUrl1}`)

    await wrapper.setProps({ url: mockUrl2 })

    expect(lineLink.attributes().href).toBe(
      `${lineSharedUrl}${encodeURIComponent(mockUrl2)}`
    )
    expect(fbLink.attributes().href).toBe(`${fbSharedUrl}${mockUrl2}`)
  })
})

describe('emitGa method', () => {
  test('with a proper argument when users click a logo link', () => {
    applyTestToGaArg('.logo', 'home')
  })

  test('with a proper argument when users click a line link', () => {
    applyTestToGaArg('a:nth-child(2)', 'line')
  })

  test('with a proper argument when users click a fb link', () => {
    applyTestToGaArg('a:nth-child(3)', 'facebook')
  })

  function applyTestToGaArg(selector, name) {
    const wrapper = createWrapper(UiShareSidebox)

    wrapper.get(selector).trigger('click')

    expect(wrapper.emitted().sendGa[0]).toEqual([
      { eventLabel: `share ${name} side` },
    ])
  }
})

function mockRaf() {
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => cb())
}

function constructDom() {
  header = document.createElement('header')
  storyContainer = document.createElement('div')
  headerTopLayer = document.createElement('div')

  storyContainer.classList.add('story-container')
  headerTopLayer.classList.add('header-top-layer')

  document.body.append(header, storyContainer, headerTopLayer)
}

function clearBody() {
  document.body.innerHTML = ''
}
