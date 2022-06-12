<template>
  <div
    :id="adOptDiv"
    class="gpt-ad-wrapper"
    :style="{
      width: adWidth,
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
    adWidth() {
      switch (this.adSizeType) {
        case 'fixed': {
          const width = this.adSize[0]
          return `${width}px`
        }
        case 'multi': {
          const widthMax = this.adSize.reduce(
            (acc, curr) => Math.max(curr[0], acc),
            0
          )
          return `${widthMax}px`
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
    if (!this.adUnit || this.adUnit === '') {
      throw new Error('adUnit props not found in GptAd component')
    }
    if (getAdSizeType(this.adSize) === undefined) {
      throw new Error(
        'GPT Ad size type cannot be specify, see https://developers.google.com/doubleclick-gpt/guides/ad-sizes'
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
        this.adSlot = adSlot
        window.googletag.pubads().refresh([adSlot])
      })
    }

    // see: https://developers.google.com/doubleclick-gpt/reference#googletag.service-addeventlistenereventtype,-listener
    window.googletag.cmd.push(() => {
      const pubads = window.googletag.pubads()
      const events = [
        'slotRequested',
        'slotRenderEnded',
        'impressionViewable',
        'slotOnload',
        'slotVisibilityChanged',
      ]
      events.forEach((event) => {
        pubads.addEventListener(event, (e) => {
          if (e.slot === this.adSlot) {
            this.$emit(event, e)
          }
        })
      })
    })
  },
  beforeDestroy() {
    window.googletag.cmd.push(() => {
      window.googletag.destroySlots([this.adSlot])
    })
  },
}
</script>

<style lang="scss" scoped>
.gpt-ad-wrapper {
  max-width: 100%;
  text-align: center;

  /* not using align-items: center; to prevent gpt layout issue */
  &::v-deep iframe {
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
