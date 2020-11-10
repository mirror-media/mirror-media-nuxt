import { mount, createLocalVue } from '@vue/test-utils'
import plugin from '../index'

describe('adNetwork settings', () => {
  test("should throw error if adNetwork not provided via plugin option or component's adNetwork props", () => {
    /* eslint-disable no-console */
    // Disable Vue warn from lifecycle hooks temporarily
    console.error = () => {}
    /* eslint-enable no-console */

    const localVue = createLocalVue()
    localVue.use(
      plugin

      /**
       * adNetwork is missing in plugin option
       * {
       *   adNetwork: '',
       * }
       */
    )

    const TestWrapperComponent = {
      template: `
        <div>
          <!-- adNetwork is missing in component props -->
          <GptAd
            :adNetwork="undefined"
            :adUnit="'adUnitMock'"
            :adSize="[0, 0]"
          />
        </div>
      `,
    }
    expect(() => {
      mount(TestWrapperComponent, {
        localVue,
      })
    }).toThrowError(
      "GPT Ad network-code not found. Please provide network-code via plugin option or component's adNetwork props, see https://developers.google.com/doubleclick-gpt/guides/get-started"
    )
  })

  test('should be a proper value from Vue plugin option', () => {
    const adNetworkMock = 'adNetwork'
    const adUnitMock = 'adUnit'
    const adSizeMock = [123, 456]
    const localVue = createLocalVue()
    localVue.use(plugin, {
      adNetwork: adNetworkMock,
    })

    const TestWrapperComponent = {
      template: `
        <div>
          <!-- adNetwork is missing in component props -->
          <GptAd
            class="ad"
            :adNetwork="undefined"
            :adUnit="adUnit"
            :adSize="adSize"
          />
        </div>
      `,
      data() {
        return {
          adUnit: adUnitMock,
          adSize: adSizeMock,
        }
      },
    }
    const wrapper = mount(TestWrapperComponent, {
      localVue,
    })
    const ad = wrapper.get('.ad')
    expect(ad.vm.$adNetwork).toBe(adNetworkMock)
  })

  test("should be a proper value from component's adNetwork props", () => {
    const adNetworkMockPluginOption = 'adNetwork'
    const adNetworkMockComponentProps = 'adNetworkComponentProps'
    const localVue = createLocalVue()
    localVue.use(plugin, {
      adNetwork: adNetworkMockPluginOption,
    })

    const TestWrapperComponent = {
      template: `
        <div>
          <GptAd
            class="ad"
            :adNetwork="adNetwork"
            :adUnit="'adUnitMock'"
            :adSize="[0, 0]"
          />
        </div>
      `,
      data() {
        return {
          adNetwork: adNetworkMockComponentProps,
        }
      },
    }
    const wrapper = mount(TestWrapperComponent, {
      localVue,
    })
    const ad = wrapper.get('.ad')
    expect(ad.vm.$adNetwork).not.toBe(adNetworkMockPluginOption)
    expect(ad.vm.$adNetwork).toBe(adNetworkMockComponentProps)
  })
})

describe('error handling', () => {
  test('should throw error when adUnit props is empty string', () => {
    const localVue = createLocalVue()
    localVue.use(plugin, {
      adNetwork: 'adNetwork',
    })

    const TestWrapperComponent = {
      template: `
        <div>
          <GptAd
            :adUnit="''"
            :adSize="[0, 0]"
          />
        </div>
      `,
    }
    expect(() => {
      mount(TestWrapperComponent, {
        localVue,
      })
    }).toThrowError('adUnit props not found in GptAd component')
  })

  test('should throw error when adSize props cannot specify', () => {
    const localVue = createLocalVue()
    localVue.use(plugin, {
      adNetwork: 'adNetwork',
    })

    const TestWrapperComponent = {
      template: `
        <div>
          <GptAd
            :adUnit="'adUnit'"
            :adSize="[]"
          />
        </div>
      `,
    }
    expect(() => {
      mount(TestWrapperComponent, {
        localVue,
      })
    }).toThrowError(
      'GPT Ad size type cannot be specify, see https://developers.google.com/doubleclick-gpt/guides/ad-sizes'
    )
  })
})

describe('mode setting', () => {
  test('should insert "test_" in front of adUnit if mode is "dev"', () => {
    const pluginMode = 'dev'
    const adNetworkMock = 'adNetwork'
    const adUnitMock = 'adUnit'
    const adSizeMock = [123, 456]
    const localVue = createLocalVue()
    localVue.use(plugin, {
      adNetwork: adNetworkMock,
      mode: pluginMode,
    })

    const TestWrapperComponent = {
      template: `
        <div>
          <!-- adNetwork is missing in component props -->
          <GptAd
            class="ad"
            :adNetwork="undefined"
            :adUnit="adUnit"
            :adSize="adSize"
          />
        </div>
      `,
      data() {
        return {
          adUnit: adUnitMock,
          adSize: adSizeMock,
        }
      },
    }
    const wrapper = mount(TestWrapperComponent, {
      localVue,
    })
    const ad = wrapper.get('.ad')
    expect(ad.vm.$adUnit).toBe(`test_${adUnitMock}`)
  })
})

describe('GptAd component computeds', () => {
  test('adUnitPath and adOptDiv', () => {
    const adNetworkMock = 'adNetwork'
    const adUnitMock = 'adUnit'
    const localVue = createLocalVue()
    localVue.use(plugin, {
      adNetwork: adNetworkMock,
    })

    const TestWrapperComponent = {
      template: `
        <div>
          <GptAd
            class="ad"
            :adUnit="'${adUnitMock}'"
            :adSize="[0, 0]"
          />
        </div>
      `,
    }
    const wrapper = mount(TestWrapperComponent, {
      localVue,
    })
    const ad = wrapper.get('.ad')
    expect(ad.vm.adUnitPath).toBe(`/${adNetworkMock}/${adUnitMock}`)
    expect(ad.vm.adOptDiv).toBe(`/${adNetworkMock}/${adUnitMock}`)
  })
})

describe('different ad sizes', () => {
  test('fixed-size ads', () => {
    const localVue = createLocalVue()
    localVue.use(plugin, {
      adNetwork: 'adNetwork',
    })

    const widthMock = 123
    const TestWrapperComponent = {
      template: `
        <div>
          <GptAd
            class="ad"
            :adUnit="'adUnit'"
            :adSize="[${widthMock}, 456]"
          />
        </div>
      `,
    }
    const wrapper = mount(TestWrapperComponent, {
      localVue,
    })
    const ad = wrapper.get('.ad')
    expect(ad.vm.adSizeType).toBe('fixed')
    expect(ad.element.style.width).toBe(`${widthMock}px`)
  })
  test('mluti-size ads', () => {
    const localVue = createLocalVue()
    localVue.use(plugin, {
      adNetwork: 'adNetwork',
    })

    const maxWidthMock = 999
    const TestWrapperComponent = {
      template: `
        <div>
          <GptAd
            class="ad"
            :adUnit="'adUnit'"
            :adSize="[
              [123, 456],
              [456, 789],
              [${maxWidthMock}, 123]
            ]"
          />
        </div>
      `,
    }
    const wrapper = mount(TestWrapperComponent, {
      localVue,
    })
    const ad = wrapper.get('.ad')
    expect(ad.vm.adSizeType).toBe('multi')
    expect(ad.element.style.width).toBe(`${maxWidthMock}px`)
  })
  test('fluid ads', () => {
    const localVue = createLocalVue()
    localVue.use(plugin, {
      adNetwork: 'adNetwork',
    })

    const TestWrapperComponent = {
      template: `
        <div>
          <GptAd
            class="ad"
            :adUnit="'adUnit'"
            :adSize="['fluid']"
          />
        </div>
      `,
    }
    const wrapper = mount(TestWrapperComponent, {
      localVue,
    })
    const ad = wrapper.get('.ad')
    expect(ad.vm.adSizeType).toBe('fluid')
    expect(ad.element.style.width).toBe('100%')
  })
})
