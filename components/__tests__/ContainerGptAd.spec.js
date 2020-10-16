import ContainerGptAd, { validateAdData } from '../ContainerGptAd.vue'

import gptUnits from '~/constants/gpt-units.js'
import createWrapperHelper from '~/test/helpers/createWrapperHelper.js'

const pageKeyMock = '57e1e0e5ee85930e00cad4e9'

const createWrapper = createWrapperHelper({
  propsData: {
    pageKey: pageKeyMock,
  },
  computed: {
    isDesktopWidth: () => false,
  },
  stubs: ['GPTAD'],
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

    const { adUnit, adSize } = gptUnits[pageKeyMock][`${device}_${adKeyMock}`]

    expect(wrapper.html()).toContain(adUnit)
    expect(wrapper.html()).toContain(adSize)
  }
})

test('throw an error for an invalid AdData', () => {
  expect(() => validateAdData(undefined)).toThrow()
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
