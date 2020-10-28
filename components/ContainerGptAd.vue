<template>
  <div>
    <GPTAD
      v-if="shouldOpenAd"
      :adUnit="adData.adUnit"
      :adSize="adData.adSize"
      :adNetwork="adNetwork"
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
      const data = gptAdUnits[this.pageKey][this.adKeyFull]

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
