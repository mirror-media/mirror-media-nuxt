import ContainerGptAd from '../ContainerGptAd.vue'

import gptAdUnits from '~/constants/gpt-ad-units.js'
import createWrapperHelper from '~/test/helpers/createWrapperHelper.js'

const pageKeyMock = '57e1e0e5ee85930e00cad4e9'

const createWrapper = createWrapperHelper({
  propsData: {
    pageKey: pageKeyMock,
    adKey: 'MB_AT3',
  },
  computed: {
    isDesktopWidth: () => false,
  },
  mocks: {
    $store: {
      state: { canAdvertise: true },
    },
  },
  stubs: ['GptAd', 'ClientOnly'],
})

describe('prop "adKey" with a device "MB" text', () => {
  test('open AD when viewport < desktop width', () => {
    applyTestToAdWithDeviceText('MB_AT2', false, (wrapper) => {
      expect(wrapper.html()).toContain('gptad')
    })
  })

  test('close AD when viewport >= desktop width', () => {
    applyTestToAdWithDeviceText('MB_AT2', true, (wrapper) => {
      expect(wrapper.html()).not.toContain('gptad')
    })
  })
})

describe('prop "adKey" with a device "PC" text', () => {
  test('open AD when viewport >= desktop width', () => {
    applyTestToAdWithDeviceText('PC_R1', true, (wrapper) => {
      expect(wrapper.html()).toContain('gptad')
    })
  })

  test('close AD when viewport < desktop width', () => {
    applyTestToAdWithDeviceText('PC_R1', false, (wrapper) => {
      expect(wrapper.html()).not.toContain('gptad')
    })
  })
})

describe('prop "adKey" without a device text', () => {
  test('AD is MB version when viewport < desktop width', () => {
    applyTestToAdWithoutDeviceText(false, 'MB')
  })

  test('AD is PC version when viewport >= desktop width', () => {
    applyTestToAdWithoutDeviceText(true, 'PC')
  })

  function applyTestToAdWithoutDeviceText(isDesktopWidth, device) {
    const adKeyMock = 'HD'
    const wrapper = createWrapper(ContainerGptAd, {
      propsData: {
        adKey: adKeyMock,
      },
      computed: {
        isDesktopWidth: () => isDesktopWidth,
      },
    })

    const { adUnit, adSize } = gptAdUnits[pageKeyMock][`${device}_${adKeyMock}`]
    const wrapperHtml = wrapper.html()

    expect(wrapperHtml).toContain(adUnit)
    expect(wrapperHtml).toContain(adSize)
  }
})

describe('GPT AD', () => {
  test('should not render when canAdvertise is false', () => {
    const wrapper = createWrapper(ContainerGptAd, {
      mocks: {
        $store: {
          state: { canAdvertise: false },
        },
      },
    })

    expect(wrapper.html()).not.toContain('gptad')
  })

  test('should not render when no adData', () => {
    const wrapper = createWrapper(ContainerGptAd, {
      computed: {
        adData: () => undefined,
      },
    })

    expect(wrapper.html()).not.toContain('gptad')
  })
})

function applyTestToAdWithDeviceText(adKey, isDesktopWidth, expectFn) {
  const wrapper = createWrapper(ContainerGptAd, {
    propsData: {
      adKey,
    },
    computed: {
      isDesktopWidth: () => isDesktopWidth,
    },
  })

  expectFn(wrapper)
}
