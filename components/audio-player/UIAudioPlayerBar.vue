<template>
  <div>
    <VueSlider
      class="slider"
      :value="value"
      v-bind="options"
      :railStyle="railStyle"
      @change="updateValue"
    />
  </div>
</template>

<script>
import VueSlider from 'vue-slider-component/dist-css/vue-slider-component.umd.min.js'
import 'vue-slider-component/dist-css/vue-slider-component.css'

export default {
  name: 'UIAudioPlayerBar',
  components: {
    VueSlider,
  },
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
    value: {
      type: Number,
      required: true,
      default: 0,
      validator: (value) => value >= 0 && value <= 1,
    },
    railStyle: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    updateValue(value) {
      this.$emit('update:value', value)
    },
  },
}
</script>

<style lang="scss" scoped>
.slider {
  cursor: pointer;
}
</style>
