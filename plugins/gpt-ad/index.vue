<template>
  <div
    :id="adOptDiv"
    :style="{
      width: width,
    }"
  />
</template>

<script>
import { getAdSizeType } from './util'

export default {
  props: {
    adNetwork: {
      type: String,
      default: undefined,
    },
    adUnit: {
      type: String,
      required: true,
    },
    adSize: {
      type: Array,
      required: true,
      validator(adSize) {
        return getAdSizeType(adSize) !== undefined
      },
    },
  },
  data() {
    return {
      adSlot: undefined,
    }
  },
  computed: {
    $adNetwork() {
      return this.adNetwork || this.adNetworkDefault
    },
    $adUnit() {
      if (this.mode === 'dev') {
        return `test_${this.adUnit}`
      }
      return this.adUnit
    },
    adUnitPath() {
      return `/${this.$adNetwork}/${this.$adUnit}`
    },
    adOptDiv() {
      return this.adUnitPath
    },
    adSizeType() {
      return getAdSizeType(this.adSize)
    },
    width() {
      switch (this.adSizeType) {
        case 'fixed': {
          const x = this.adSize[0]
          return `${x}px`
        }
        case 'multi': {
          const xMax = this.adSize.reduce(
            (acc, curr) => Math.max(curr[0], acc),
            0
          )
          return `${xMax}px`
        }
        case 'fluid':
        default:
          return '100%'
      }
    },
  },
  beforeMount() {
    if (!this.$adNetwork) {
      throw new Error(
        "GPT Ad network-code not found. Please provide network-code via plugin option or component's adNetwork props, see https://developers.google.com/doubleclick-gpt/guides/get-started"
      )
    }
  },
  mounted() {
    const adSlot = this.$getGPTAdSlotsDefined(this.adOptDiv)
    if (!adSlot) {
      window.googletag.cmd.push(() => {
        this.adSlot = window.googletag
          .defineSlot(this.adUnitPath, this.adSize, this.adOptDiv)
          .addService(window.googletag.pubads())

        this.$setGPTAdSlotsDefined(this.adOptDiv, this.adSlot)
      })

      window.googletag.cmd.push(() => {
        window.googletag.display(this.adOptDiv)
      })
    } else {
      window.googletag.cmd.push(() => {
        window.googletag.pubads().refresh([adSlot])
      })
    }
  },
}
</script>
