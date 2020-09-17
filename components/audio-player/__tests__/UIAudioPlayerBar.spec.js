import VueSlider from 'vue-slider-component/dist-css/vue-slider-component.umd.min.js'
import UIAudioPlayerBar from '../UIAudioPlayerBar.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  propsData: {
    value: 0.5,
  },
})

test('emit an "update:value" with a correct value when the slider emits a "change"', () => {
  const wrapper = createWrapper(UIAudioPlayerBar)
  const slider = wrapper.findComponent(VueSlider)
  const mockValue = 0.2

  slider.vm.$emit('change', mockValue)

  expect(wrapper.emitted()['update:value'][0]).toEqual([mockValue])
})
