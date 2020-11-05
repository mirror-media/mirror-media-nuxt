<template>
  <div v-if="$store.state.canAdvertise" class="container-gpt-ad">
    <GPTAD
      v-if="shouldOpenAd"
      :adUnit="adData.adUnit"
      :adSize="adData.adSize"
      :adNetwork="adNetwork"
      v-on="$listeners"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import gptAdUnits from '~/constants/gpt-ad-units.js'

export default {
  name: 'ContainerGptAd',

  props: {
    pageKey: {
      type: String,
      required: true,
    },
    adKey: {
      type: String,
      required: true,
    },
    adNetwork: {
      type: String,
      default: undefined,
    },
  },

  data() {
    return {
      hasRequested: false,
    }
  },

  computed: {
    ...mapGetters({
      isDesktopWidth: 'viewport/isViewportWidthUpLg',
    }),
    shouldOpenAd() {
      if (this.isVersionOf('MB')) {
        return !this.isDesktopWidth
      } else if (this.isVersionOf('PC')) {
        return this.isDesktopWidth
      } else {
        return true
      }
    },
    adData() {
      const data = gptAdUnits[this.pageKey]?.[this.adKeyFull]

      validateAdData(data)

      return data
    },
    device() {
      return this.isDesktopWidth ? 'PC' : 'MB'
    },
    adKeyFull() {
      return this.adKey.includes('_')
        ? this.adKey
        : `${this.device}_${this.adKey}`
    },
  },

  methods: {
    isVersionOf(device) {
      return this.adKeyFull.includes(device)
    },
  },
}

function validateAdData(data) {
  if (data === undefined) {
    throw new Error(
      'Unable to find the AD data. Please provide a vaild pageKey or adKey'
    )
  }
}

export { validateAdData }
</script>

<style lang="scss" scoped>
/**
 * 廣告有時會替換掉原本 <GPTAD> 元件裡頭的根元素 <div>
 * 因此用 ::v-deep，並不限定所指定的元素類型（*）
 * 以確保能選擇到 .container-gpt-ad 的直接子元素
 */
.container-gpt-ad::v-deep > * {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>
